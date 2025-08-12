const axios = require('axios');
const fs = require('fs');
const csv = require('csv-parser');

class InvoiceNinjaInvoiceClient {
  constructor(baseUrl, apiToken) {
    this.baseUrl = baseUrl;
    this.apiToken = apiToken;
    this.headers = {
      'X-API-TOKEN': apiToken,
      'Content-Type': 'application/json',
      'X-Requested-With': 'XMLHttpRequest',
    };
  }

  async getAllClients() {
    const maxRetries = 3;
    let retryCount = 0;
    
    while (retryCount < maxRetries) {
      try {
        let allClients = [];
        let page = 1;
        let hasMorePages = true;
        
        while (hasMorePages) {
          const response = await axios.get(
            `${this.baseUrl}/api/v1/clients?page=${page}&per_page=100`,
            { headers: this.headers }
          );
          
          const clients = response.data.data || [];
          allClients = allClients.concat(clients);
          
          
          const meta = response.data.meta;
          hasMorePages = meta && meta.pagination && meta.pagination.current_page < meta.pagination.total_pages;
          
          console.log(`📄 Loaded page ${page}: ${clients.length} clients (Total so far: ${allClients.length})`);
          page++;
          
          
          if (page > 100) {
            console.warn('⚠️  Stopped at page 100 to prevent infinite loop');
            break;
          }
        }
        
        return allClients;
      } catch (error) {
        
        if (error.response?.status === 504 || error.message.includes('504')) {
          retryCount++;
          if (retryCount < maxRetries) {
            const waitTime = Math.pow(2, retryCount) * 1000; 
            console.log(`⏳ 504 timeout error loading clients, retrying in ${waitTime/1000}s (attempt ${retryCount}/${maxRetries})...`);
            await new Promise(resolve => setTimeout(resolve, waitTime));
            continue;
          }
        }
        
        console.error('❌ Error fetching clients:', error.response?.data || error.message);
        throw error;
      }
    }
  }

  async createInvoice(invoiceData, options = {}) {
    const maxRetries = 3;
    let retryCount = 0;
    
    while (retryCount < maxRetries) {
      try {
        let url = `${this.baseUrl}/api/v1/invoices`;
        
        
        const queryParams = [];
        if (options.markSent) {
          queryParams.push('mark_sent=true');
        }
        
        if (queryParams.length > 0) {
          url += '?' + queryParams.join('&');
        }

        const response = await axios.post(url, invoiceData, { headers: this.headers });
        
        console.log('✅ Invoice created successfully!');
        console.log(`   Number: ${invoiceData.number}`);
        console.log(`   Client: ${response.data.data.client?.name || 'Unknown'}`);
        console.log(`   Total: ${invoiceData.line_items?.[0]?.cost || 'N/A'}`);
        console.log(`   ID: ${response.data.data.id}`);
        
        return response.data.data;
      } catch (error) {
        
        if (error.response?.data?.errors?.number && 
            error.response.data.errors.number.includes('The number has already been taken.')) {
          console.log('⚠️  Invoice number already exists - skipping');
          console.log(`   Number: ${invoiceData.number}`);
          
          
          return {
            id: 'skipped',
            number: invoiceData.number,
            skipped: true,
            reason: 'duplicate_number'
          };
        }
        
        
        if (error.response?.status === 504 || error.message.includes('504')) {
          retryCount++;
          if (retryCount < maxRetries) {
            const waitTime = Math.pow(2, retryCount) * 1000; 
            console.log(`⏳ 504 timeout error, retrying in ${waitTime/1000}s (attempt ${retryCount}/${maxRetries})...`);
            await new Promise(resolve => setTimeout(resolve, waitTime));
            continue;
          }
        }
        
        console.error('❌ Error creating invoice:', error.response?.data || error.message);
        throw error;
      }
    }
  }

  async createPayment(paymentData) {
    const maxRetries = 3;
    let retryCount = 0;
    
    while (retryCount < maxRetries) {
      try {
        const url = `${this.baseUrl}/api/v1/payments?include=first_load&email_receipt=false`;
        
        const response = await axios.post(url, paymentData, { headers: this.headers });
        
        console.log('💰 Payment created successfully!');
        console.log(`   Amount: ${paymentData.amount} EUR`);
        console.log(`   Date: ${paymentData.date}`);
        console.log(`   Payment ID: ${response.data.data.id}`);
        
        return response.data.data;
      } catch (error) {
        
        if (error.response?.status === 504 || error.message.includes('504')) {
          retryCount++;
          if (retryCount < maxRetries) {
            const waitTime = Math.pow(2, retryCount) * 1000; 
            console.log(`⏳ 504 timeout error on payment, retrying in ${waitTime/1000}s (attempt ${retryCount}/${maxRetries})...`);
            await new Promise(resolve => setTimeout(resolve, waitTime));
            continue;
          }
        }
        
        console.error('❌ Error creating payment:', error.response?.data || error.message);
        throw error;
      }
    }
  }
}

class CSVInvoiceProcessor {
  constructor(invoiceNinjaClient) {
    this.invoiceNinjaClient = invoiceNinjaClient;
    this.successCount = 0;
    this.skippedCount = 0;
    this.paymentCount = 0;
    this.errorCount = 0;
    this.errors = [];
    this.clientsCache = new Map(); 
  }

  async initializeClientsCache() {
    console.log('🔄 Loading clients from Invoice Ninja...');
    try {
      const clients = await this.invoiceNinjaClient.getAllClients();
      
      console.log(`\n📋 Available clients:`);
      
      
      clients.forEach((client, index) => {
        
        this.clientsCache.set(client.name.toLowerCase(), client);
        
        
        if (client.custom_value1) {
          this.clientsCache.set(client.custom_value1.toLowerCase(), client);
        }
        
        
        if (index < 10) {
          console.log(`   ${index + 1}. "${client.name}" (ID: ${client.id})`);
        }
      });
      
      if (clients.length > 10) {
        console.log(`   ... and ${clients.length - 10} more clients`);
      }
      
      console.log(`✅ Loaded ${clients.length} clients into cache\n`);
    } catch (error) {
      console.error('❌ Failed to load clients:', error);
      throw error;
    }
  }

  findClientByName(thirdpartyName) {
    
    let client = this.clientsCache.get(thirdpartyName.toLowerCase());
    
    if (!client) {
      
      for (const [key, value] of this.clientsCache.entries()) {
        if (key.includes(thirdpartyName.toLowerCase()) || 
            thirdpartyName.toLowerCase().includes(key)) {
          client = value;
          console.log(`🔍 Found partial match: "${thirdpartyName}" → "${value.name}"`);
          break;
        }
      }
    }
    
    if (!client) {
      
      const similarClients = [];
      for (const [key, value] of this.clientsCache.entries()) {
        if (this.calculateSimilarity(key, thirdpartyName.toLowerCase()) > 0.3) {
          similarClients.push(value.name);
        }
      }
      
      if (similarClients.length > 0) {
        console.log(`🔍 Similar clients found for "${thirdpartyName}":`, similarClients.slice(0, 5));
      }
    }
    
    return client;
  }

  calculateSimilarity(str1, str2) {
    const longer = str1.length > str2.length ? str1 : str2;
    const shorter = str1.length > str2.length ? str2 : str1;
    
    if (longer.length === 0) return 1.0;
    
    const editDistance = this.levenshteinDistance(longer, shorter);
    return (longer.length - editDistance) / longer.length;
  }

  levenshteinDistance(str1, str2) {
    const matrix = [];
    
    for (let i = 0; i <= str2.length; i++) {
      matrix[i] = [i];
    }
    
    for (let j = 0; j <= str1.length; j++) {
      matrix[0][j] = j;
    }
    
    for (let i = 1; i <= str2.length; i++) {
      for (let j = 1; j <= str1.length; j++) {
        if (str2.charAt(i - 1) === str1.charAt(j - 1)) {
          matrix[i][j] = matrix[i - 1][j - 1];
        } else {
          matrix[i][j] = Math.min(
            matrix[i - 1][j - 1] + 1,
            matrix[i][j - 1] + 1,
            matrix[i - 1][j] + 1
          );
        }
      }
    }
    
    return matrix[str2.length][str1.length];
  }

  parseDate(dateString) {
    
    if (!dateString) return null;
    
    const parts = dateString.split('/');
    if (parts.length === 3) {
      return `${parts[2]}-${parts[1].padStart(2, '0')}-${parts[0].padStart(2, '0')}`;
    }
    return dateString;
  }

  parseCurrency(amountString) {
    if (!amountString) return 0;
    
    
    const cleanAmount = amountString.toString().replace(/[€$,]/g, '').trim();
    return parseFloat(cleanAmount) || 0;
  }

  mapCSVToInvoice(fields) {
    const [
      invoiceId, invoiceNumber, date, dueDate, thirdparty, thirdpartyIdentifier,
      thirdpartyReference, totalIncVat, totalVat, totalBeforeTax, currency,
      file, importDate, modificationDate, breakdownPeriod, status, draft,
      discount, discountType, paidAmount, remainingAmount, documentTitle,
      documentDescription, freeText, specialMentions, comments, paymentDate
    ] = fields;

    
    if (!thirdparty || !invoiceNumber || !totalBeforeTax) {
      return null;
    }

    
    const client = this.findClientByName(thirdparty.trim());
    if (!client) {
      throw new Error(`Client not found: ${thirdparty}`);
    }

    
    const amount = this.parseCurrency(totalBeforeTax);
    const vatAmount = this.parseCurrency(totalVat);
    const isPaid = status?.toLowerCase() === 'paid';

    
    const lineItem = {
      quantity: 1,
      cost: amount,
      product_key: invoiceNumber || '',
      notes: documentDescription || freeText || 'Imported invoice',
      discount: parseFloat(discount) || 0,
      is_amount_discount: discountType === 'absolute',
      tax_name1: vatAmount > 0 ? 'VAT' : '',
      tax_rate1: vatAmount > 0 ? ((vatAmount / amount) * 100) : 0,
      tax_name2: '',
      tax_rate2: 0,
      tax_name3: '',
      tax_rate3: 0,
      sort_id: '0',
      custom_value1: file || '',
      custom_value2: invoiceId || '',
      custom_value3: '',
      custom_value4: '',
      type_id: '1'
    };

    
    const invoiceData = {
      client_id: client.id,
      number: `PLANE-${invoiceNumber.trim()}`,
      date: this.parseDate(date),
      due_date: this.parseDate(dueDate),
      po_number: thirdpartyReference || '',
      public_notes: documentDescription || '',
      private_notes: comments || '',
      terms: specialMentions || '',
      custom_value1: invoiceId || '',
      custom_value2: 'EUR', 
      custom_value3: status || '',
      line_items: [lineItem]
    };

    return {
      invoiceData,
      isPaid,
      paidAmount: this.parseCurrency(paidAmount),
      paymentDate: this.parseDate(paymentDate)
    };
  }

  async processCSVFile(filePath, options = {}) {
    const { 
      delay = 1000, 
      maxErrors = 10,
      skipHeader = true,
      dryRun = false 
    } = options;

    console.log(`🚀 Starting Invoice CSV processing...`);
    console.log(`📁 File: ${filePath}`);
    console.log(`⏱️  Delay between requests: ${delay}ms`);
    console.log(`🧪 Dry run mode: ${dryRun ? 'ON' : 'OFF'}`);
    console.log('─'.repeat(60));

    
    await this.initializeClientsCache();

    return new Promise((resolve, reject) => {
      const results = [];
      let lineNumber = 0;

      fs.createReadStream(filePath)
        .pipe(csv({
          separator: ';',
          headers: [
            'invoiceId', 'invoiceNumber', 'date', 'dueDate', 'thirdparty',
            'thirdpartyIdentifier', 'thirdpartyReference', 'totalIncVat',
            'totalVat', 'totalBeforeTax', 'currency', 'file', 'importDate',
            'modificationDate', 'breakdownPeriod', 'status', 'draft',
            'discount', 'discountType', 'paidAmount', 'remainingAmount',
            'documentTitle', 'documentDescription', 'freeText',
            'specialMentions', 'comments', 'paymentDate'
          ],
          skipEmptyLines: true
        }))
        .on('data', async (data) => {
          lineNumber++;
          
          
          if (skipHeader && lineNumber === 1) {
            return;
          }

          try {
            const invoiceMapping = this.mapCSVToInvoice(Object.values(data));
            
            if (!invoiceMapping) {
              console.log(`⏭️  Skipping line ${lineNumber}: Invalid invoice data`);
              return;
            }

            const { invoiceData, isPaid, paidAmount, paymentDate } = invoiceMapping;

            if (dryRun) {
              console.log(`📋 [DRY RUN] Would create invoice: ${invoiceData.number}`);
              console.log(`   Client: ${data.thirdparty}`);
              console.log(`   Amount: ${invoiceData.line_items[0].cost} EUR`);
              console.log(`   Status: ${isPaid ? 'PAID' : 'PENDING'}`);
              return;
            }

            console.log(`📤 Processing invoice: ${invoiceData.number} (Line ${lineNumber})`);
            
            
            const result = await this.invoiceNinjaClient.createInvoice(
              invoiceData,
              {
                markSent: true
              }
            );
            
            
            if (result.skipped) {
              this.skippedCount++;
            } else {
              this.successCount++;
              
              
              if (isPaid && paidAmount > 0 && paymentDate) {
                try {
                  const paymentData = {
                    client_id: invoiceData.client_id,
                    type_id: "1", 
                    date: paymentDate,
                    amount: paidAmount,
                    invoices: [
                      {
                        invoice_id: result.id,
                        amount: paidAmount.toString()
                      }
                    ],
                    number: `PLANE_${invoiceData.number}`,
                    private_notes: `Payment for invoice ${invoiceData.number}`
                  };
                  
                  await this.invoiceNinjaClient.createPayment(paymentData);
                  this.paymentCount++;
                } catch (paymentError) {
                  console.error(`⚠️  Failed to create payment for invoice ${invoiceData.number}:`, paymentError.message);
                  
                }
              }
            }
            
            results.push(result);

            
            if (delay > 0) {
              await new Promise(resolve => setTimeout(resolve, delay));
            }

          } catch (error) {
            
            const is504Error = error.response?.status === 504 || error.message.includes('504');
            
            if (!is504Error) {
              this.errorCount++;
            }
            
            const errorInfo = {
              line: lineNumber,
              invoice: data.invoiceNumber || 'Unknown',
              client: data.thirdparty || 'Unknown',
              error: error.message,
              is504: is504Error
            };
            this.errors.push(errorInfo);
            
            if (is504Error) {
              console.error(`⏳ Temporary timeout on line ${lineNumber}: ${error.message} (not counted towards error limit)`);
            } else {
              console.error(`❌ Error on line ${lineNumber}: ${error.message}`);
            }

            if (this.errorCount >= maxErrors) {
              console.error(`🛑 Max errors (${maxErrors}) reached. Stopping process.`);
              reject(new Error(`Max errors reached: ${maxErrors}`));
              return;
            }
          }
        })
        .on('end', () => {
          this.printSummary();
          resolve(results);
        })
        .on('error', (error) => {
          console.error('❌ CSV parsing error:', error);
          reject(error);
        });
    });
  }

  printSummary() {
    console.log('\n' + '='.repeat(60));
    console.log('📊 INVOICE PROCESSING SUMMARY');
    console.log('='.repeat(60));
    console.log(`✅ Successful creations: ${this.successCount}`);
    console.log(`💰 Payments created: ${this.paymentCount}`);
    console.log(`⏭️  Skipped (duplicates): ${this.skippedCount}`);
    console.log(`❌ Errors: ${this.errorCount}`);
    console.log(`📊 Total processed: ${this.successCount + this.skippedCount + this.errorCount}`);
    
    if (this.errors.length > 0) {
      console.log('\n❌ Error details:');
      this.errors.forEach((error, index) => {
        console.log(`${index + 1}. Line ${error.line} - ${error.invoice} (${error.client}): ${error.error}`);
      });
    }
    
    console.log('='.repeat(60));
  }
}


const INVOICE_NINJA_URL = '';
const API_TOKEN = ''; 
const CSV_FILE_PATH = './invoices.csv'; 


async function main() {
  try {
    
    const invoiceNinja = new InvoiceNinjaInvoiceClient(INVOICE_NINJA_URL, API_TOKEN);
    const processor = new CSVInvoiceProcessor(invoiceNinja);

    
    await processor.processCSVFile(CSV_FILE_PATH, {
      delay: 5000,       
      maxErrors: 50,     
      skipHeader: true,  
      dryRun: false       
    });

  } catch (error) {
    console.error('💥 Script execution failed:', error.message);
    process.exit(1);
  }
}


if (require.main === module) {
  main();
}

module.exports = { InvoiceNinjaInvoiceClient, CSVInvoiceProcessor };
