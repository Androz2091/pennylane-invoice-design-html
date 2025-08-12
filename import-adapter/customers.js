const axios = require('axios');
const fs = require('fs');
const csv = require('csv-parser');

class InvoiceNinjaClient {
  constructor(baseUrl, apiToken) {
    this.baseUrl = baseUrl;
    this.apiToken = apiToken;
    this.headers = {
      'X-API-TOKEN': apiToken,
      'Content-Type': 'application/json',
      'X-Requested-With': 'XMLHttpRequest',
    };
  }

  async createClient(clientData) {
    try {
      const response = await axios.post(
        `${this.baseUrl}/api/v1/clients`,
        clientData,
        { headers: this.headers }
      );
      
      console.log('✅ Client created successfully!');
      console.log(`   Name: ${clientData.name}`);
      console.log(`   ID: ${response.data.data.id}`);
      console.log(`   Number: ${response.data.data.number}`);
      return response.data.data;
    } catch (error) {
      console.error('❌ Error creating client:', error.response?.data || error.message);
      throw error;
    }
  }
}


const countryMapping = {
  'AF': 4, 'AL': 8, 'DZ': 12, 'AS': 16, 'AD': 20, 'AO': 24, 'AG': 28,
  'AZ': 31, 'AR': 32, 'AU': 36, 'AT': 40, 'BS': 44, 'BH': 48, 'BD': 50,
  'AM': 51, 'BB': 52, 'BE': 56, 'BM': 60, 'BT': 64, 'BO': 68, 'BA': 70,
  'BW': 72, 'BV': 74, 'BR': 76, 'BZ': 84, 'IO': 86, 'SB': 90, 'VG': 92,
  'BN': 96, 'BG': 100, 'MM': 104, 'BI': 108, 'BY': 112, 'KH': 116,
  'CM': 120, 'CA': 124, 'CV': 132, 'KY': 136, 'CF': 140, 'LK': 144,
  'TD': 148, 'CL': 152, 'CN': 156, 'TW': 158, 'CX': 162, 'CC': 166,
  'CO': 170, 'KM': 174, 'YT': 175, 'CG': 178, 'CD': 180, 'CK': 184,
  'CR': 188, 'HR': 191, 'CU': 192, 'CY': 196, 'CZ': 203, 'BJ': 204,
  'DK': 208, 'DM': 212, 'DO': 214, 'EC': 218, 'SV': 222, 'GQ': 226,
  'ET': 231, 'ER': 232, 'EE': 233, 'FO': 234, 'FK': 238, 'GS': 239,
  'FJ': 242, 'FI': 246, 'AX': 248, 'FR': 250, 'GF': 254, 'PF': 258,
  'TF': 260, 'DJ': 262, 'GA': 266, 'GE': 268, 'GM': 270, 'PS': 275,
  'DE': 276, 'GH': 288, 'GI': 292, 'KI': 296, 'GR': 300, 'GL': 304,
  'GD': 308, 'GP': 312, 'GU': 316, 'GT': 320, 'GN': 324, 'GY': 328,
  'HT': 332, 'HM': 334, 'VA': 336, 'HN': 340, 'HK': 344, 'HU': 348,
  'IS': 352, 'IN': 356, 'ID': 360, 'IR': 364, 'IQ': 368, 'IE': 372,
  'IL': 376, 'IT': 380, 'CI': 384, 'JM': 388, 'JP': 392, 'KZ': 398,
  'JO': 400, 'KE': 404, 'KP': 408, 'KR': 410, 'KW': 414, 'KG': 417,
  'LA': 418, 'LB': 422, 'LS': 426, 'LV': 428, 'LR': 430, 'LY': 434,
  'LI': 438, 'LT': 440, 'LU': 442, 'MO': 446, 'MG': 450, 'MW': 454,
  'MY': 458, 'MV': 462, 'ML': 466, 'MT': 470, 'MQ': 474, 'MR': 478,
  'MU': 480, 'MX': 484, 'MC': 492, 'MN': 496, 'MD': 498, 'ME': 499,
  'MS': 500, 'MA': 504, 'MZ': 508, 'OM': 512, 'NA': 516, 'NR': 520,
  'NP': 524, 'NL': 528, 'CW': 531, 'AW': 533, 'SX': 534, 'BQ': 535,
  'NC': 540, 'VU': 548, 'NZ': 554, 'NI': 558, 'NE': 562, 'NG': 566,
  'NU': 570, 'NF': 574, 'NO': 578, 'MP': 580, 'UM': 581, 'FM': 583,
  'MH': 584, 'PW': 585, 'PK': 586, 'PA': 591, 'PG': 598, 'PY': 600,
  'PE': 604, 'PH': 608, 'PN': 612, 'PL': 616, 'PT': 620, 'GW': 624,
  'TL': 626, 'PR': 630, 'QA': 634, 'RE': 638, 'RO': 642, 'RU': 643,
  'RW': 646, 'BL': 652, 'SH': 654, 'KN': 659, 'AI': 660, 'LC': 662,
  'MF': 663, 'PM': 666, 'VC': 670, 'SM': 674, 'ST': 678, 'SA': 682,
  'SN': 686, 'RS': 688, 'SC': 690, 'SL': 694, 'SG': 702, 'SK': 703,
  'VN': 704, 'SI': 705, 'SO': 706, 'ZA': 710, 'ZW': 716, 'ES': 724,
  'SS': 728, 'SD': 729, 'EH': 732, 'SR': 740, 'SJ': 744, 'SZ': 748,
  'SE': 752, 'CH': 756, 'SY': 760, 'TJ': 762, 'TH': 764, 'TG': 768,
  'TK': 772, 'TO': 776, 'TT': 780, 'AE': 784, 'TN': 788, 'TR': 792,
  'TM': 795, 'TC': 796, 'TV': 798, 'UG': 800, 'UA': 804, 'MK': 807,
  'EG': 818, 'GB': 826, 'GG': 831, 'JE': 832, 'IM': 833, 'TZ': 834,
  'US': 840, 'VI': 850, 'BF': 854, 'UY': 858, 'UZ': 860, 'VE': 862,
  'WF': 876, 'WS': 882, 'YE': 887, 'ZM': 894
};

class CSVClientProcessor {
  constructor(invoiceNinjaClient) {
    this.invoiceNinjaClient = invoiceNinjaClient;
    this.successCount = 0;
    this.errorCount = 0;
    this.errors = [];
  }

  parseCSVLine(line) {
    
    const fields = [];
    let current = '';
    let inQuotes = false;
    
    for (let i = 0; i < line.length; i++) {
      const char = line[i];
      
      if (char === '"') {
        inQuotes = !inQuotes;
      } else if (char === ';' && !inQuotes) {
        fields.push(current.trim());
        current = '';
      } else {
        current += char;
      }
    }
    fields.push(current.trim());
    
    return fields;
  }

  mapCSVToClient(fields) {
    const [
      role, login, clientRef, denomination, firstName, lastName, sex,
      address, postalCode, city, country, deliveryAddress, postcodeDelivery,
      cityDelivery, deliveryCountry, emails, phone, registrationNumber,
      vatNumber, customerType, vatRate, numInvoices, turnover, mandate
    ] = fields;

    
    if (role !== 'Customer' || !denomination.trim()) {
      return null;
    }

    
    const countryId = countryMapping[country] || 840; 

    
    const emailList = emails ? emails.split(',').map(e => e.trim()).filter(e => e) : [];
    const primaryEmail = emailList[0] || '';

    
    const clientData = {
      name: denomination.replace(/"/g, '').trim(),
      country_id: countryId,
      contacts: []
    };

    
    if (firstName || lastName || primaryEmail) {
      clientData.contacts.push({
        first_name: firstName.replace(/"/g, '').trim() || '',
        last_name: lastName.replace(/"/g, '').trim() || '',
        email: primaryEmail,
        phone: phone.replace(/"/g, '').trim() || '',
        send_email: !!primaryEmail
      });
    }

    
    if (address && address.trim()) {
      clientData.address1 = address.replace(/"/g, '').trim();
    }
    if (city && city.trim()) {
      clientData.city = city.replace(/"/g, '').trim();
    }
    if (postalCode && postalCode.trim()) {
      clientData.postal_code = postalCode.replace(/"/g, '').trim();
    }

    
    if (vatNumber && vatNumber.trim()) {
      clientData.vat_number = vatNumber.replace(/"/g, '').trim();
    }
    if (registrationNumber && registrationNumber.trim()) {
      clientData.id_number = registrationNumber.replace(/"/g, '').trim();
    }

    
    if (customerType && customerType.trim()) {
      clientData.custom_value1 = customerType.replace(/"/g, '').trim();
    }
    if (turnover && turnover.trim()) {
      clientData.custom_value2 = `Turnover: ${turnover.replace(/"/g, '').trim()}`;
    }

    return clientData;
  }

  async processCSVFile(filePath, options = {}) {
    const { 
      delay = 1000, 
      maxErrors = 10,
      skipHeader = true,
      dryRun = true 
    } = options;

    console.log(`🚀 Starting CSV processing...`);
    console.log(`📁 File: ${filePath}`);
    console.log(`⏱️  Delay between requests: ${delay}ms`);
    console.log(`🧪 Dry run mode: ${dryRun ? 'ON' : 'OFF'}`);
    console.log('─'.repeat(60));

    return new Promise((resolve, reject) => {
      const results = [];
      let lineNumber = 0;

      fs.createReadStream(filePath)
        .pipe(csv({
          separator: ';',
          headers: [
            'role', 'login', 'clientRef', 'denomination', 'firstName', 
            'lastName', 'sex', 'address', 'postalCode', 'city', 'country',
            'deliveryAddress', 'postcodeDelivery', 'cityDelivery', 
            'deliveryCountry', 'emails', 'phone', 'registrationNumber',
            'vatNumber', 'customerType', 'vatRate', 'numInvoices', 
            'turnover', 'mandate'
          ],
          skipEmptyLines: true
        }))
        .on('data', async (data) => {
          lineNumber++;
          
          
          if (skipHeader && lineNumber === 1) {
            return;
          }

          try {
            const clientData = this.mapCSVToClient(Object.values(data));
            
            if (!clientData) {
              console.log(`⏭️  Skipping line ${lineNumber}: Not a valid customer`);
              return;
            }

            if (dryRun) {
              console.log(`📋 [DRY RUN] Would create: ${clientData.name}`);
              console.log(`   Email: ${clientData.contacts[0]?.email || 'N/A'}`);
              console.log(`   Country: ${clientData.country_id}`);
              return;
            }

            console.log(`📤 Processing: ${clientData.name} (Line ${lineNumber})`);
            
            const result = await this.invoiceNinjaClient.createClient(clientData);
            this.successCount++;
            results.push(result);

            
            if (delay > 0) {
              await new Promise(resolve => setTimeout(resolve, delay));
            }

          } catch (error) {
            this.errorCount++;
            const errorInfo = {
              line: lineNumber,
              name: data.denomination || 'Unknown',
              error: error.message
            };
            this.errors.push(errorInfo);
            
            console.error(`❌ Error on line ${lineNumber}: ${error.message}`);

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
    console.log('📊 PROCESSING SUMMARY');
    console.log('='.repeat(60));
    console.log(`✅ Successful creations: ${this.successCount}`);
    console.log(`❌ Errors: ${this.errorCount}`);
    
    if (this.errors.length > 0) {
      console.log('\n❌ Error details:');
      this.errors.forEach((error, index) => {
        console.log(`${index + 1}. Line ${error.line} - ${error.name}: ${error.error}`);
      });
    }
    
    console.log('='.repeat(60));
  }
}


const INVOICE_NINJA_URL = '';
const API_TOKEN = '';
const CSV_FILE_PATH = './customers.csv';


async function main() {
  try {
    
    const invoiceNinja = new InvoiceNinjaClient(INVOICE_NINJA_URL, API_TOKEN);
    const processor = new CSVClientProcessor(invoiceNinja);

    
    await processor.processCSVFile(CSV_FILE_PATH, {
      delay: 1000,        
      maxErrors: 5,       
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

module.exports = { InvoiceNinjaClient, CSVClientProcessor };
