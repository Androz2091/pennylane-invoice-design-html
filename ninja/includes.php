<style id="style">
    @import url("https://fonts.googleapis.com/css?family=Manrope:400,600,700,800");

    :root {
        --primary-color: $primary_color;
        --secondary-color: $secondary_color;
        --line-height: 1.4;
    }

    * {
        margin: 0;
        padding: 0;
        box-sizing: border-box;
    }

    a {
        color: white;
        text-decoration: none;
    }

    body {
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
        font-family: $font_name, 'Manrope', Helvetica, sans-serif;
        font-size: $font_size !important;
        line-height: 1.4;
        color: #333;
        background: #fff;
        padding: 40px;
        max-width: 800px;
        margin: 0 auto;
    }

    @page {
        margin: 0 !important;
        size: $page_size $page_layout;
    }

    /* Header Styles */
    .invoice-header,
    .header {
        display: flex;
        justify-content: space-between;
        margin-bottom: 40px;
        padding: 0;
        background: transparent;
        position: static;
    }

    .company-name {
        font-size: 28px;
        font-weight: bold;
        color: #333;
    }

    .company-info {
        text-align: right;
        color: #666;
    }

    .company-address,
    .company-location,
    .company-phone {
        color: #666;
    }

    .company-logo {
        max-width: $company_logo_size;
        max-height: 60px;
        object-fit: contain;
    }

    /* Invoice Details Section */
    .invoice-details {
        display: flex;
        justify-content: space-between;
        margin-bottom: 30px;
    }

    .invoice-left {
        flex: 1;
    }

    .invoice-right {
        flex: 1;
        text-align: right;
        color: #666;
    }

    .client-address,
    .client-location {
        color: #666;
    }

    .section-title {
        font-size: 18px;
        color: #999;
        margin-bottom: 15px;
    }

    .detail-row {
        display: flex;
        margin-bottom: 5px;
    }

    .detail-label {
        font-weight: 700;
        width: 140px;
    }

    .detail-value {
        flex: 1;
    }
    }

    .party-name {
        font-weight: bold;
        font-size: 16px;
        color: #333;
        margin-bottom: 5px;
    }

    .label {
        color: #333;
    }

    /* Table Styles */
    [data-ref="table"],
    .products-table,
    .product-table {
        width: 100%;
        border-collapse: collapse;
        margin: 30px 0;
        table-layout: fixed;
    }

    .product-table {
        margin: 1.0em 0 0em 0em;
    }

    [data-ref="table"] th,
    .products-table th,
    .product-table th {
        background: #f8f8f8;
        padding: 12px 8px;
        text-align: left;
        font-weight: bold;
        border-bottom: 1px solid #ddd;
        font-size: $font_size;
    }

    .product-table thead {
        background: #f0f0f0;
    }

    .product-table th,
    .product-table td {
        padding: 10px 8px;
        font-size: 0.95em;
        border-bottom: 0px solid #ddd;
    }

    [data-ref="table"] td,
    .products-table td {
        padding: 8px;
        border-bottom: 1px solid #eee;
        vertical-align: top;
        font-size: calc($font_size - 1px);
    }

    .product-table td {
        padding-top: 10px;
        padding-bottom: 5px;
    }

    [data-ref="table"] th:last-child,
    [data-ref="table"] td:last-child,
    .products-table th:last-child,
    .products-table td:last-child,
    .product-table th:not(:first-child),
    .product-table td:not(:first-child) {
        text-align: right;
    }

    .product-table th:nth-child(1),
    .product-table td:nth-child(1) {
        text-align: left;
    }

    .product-table tbody tr:last-child td {
        border-bottom: 0px solid #ddd;
        padding-bottom: 1.5em;
    }

    /* Product table specific styles */
    .product-table .item-key {
        font-weight: bold;
        font-size: 16px;
        font-style: normal;
    }

    .product-table .centered {
        text-align: right;
    }

    .product-table .currency {
        white-space: nowrap;
    }

    .product-table .notes {
        font-size: 12px;
        color: #666;
        padding: 0px 100px 0px 0px;
        line-height: auto;
    }

    .product-table .notes > span {
        display: inline-block;
        font-weight: 300;
        padding: 0;
        padding-left: 10px;
        text-indent: 0px;
    }

    .product-table .note-row td {
        border-bottom: 0px solid;
    }

    .product-table .note-row td:before {
        content: '';
        margin-right: 4px;
        color: #aaa;
    }

    .product-description {
        margin-top: 5px;
        font-size: calc($font_size - 2px);
        color: #666;
        padding: 10px 8px;
    }

    .product-description ul {
        margin-left: 15px;
        margin-top: 5px;
    }

    .product-note {
        font-size: calc($font_size - 2px);
        color: #666;
        margin-top: 10px;
        font-style: italic;
    }

    /* Tax and Summary Section */
    .tax-summary-section,
    .tva-section {
        display: flex;
        justify-content: space-between;
        margin: 30px 0;
    }

    .tax-details,
    .tva-details {
        flex: 1;
    }

    .invoice-summary,
    .tva-summary {
        width: 250px;
        margin-left: 50px;
    }

    .tax-table,
    .tva-table,
    .summary-table {
        width: 100%;
        border-collapse: collapse;
    }

    .tax-table th,
    .tax-table td,
    .tva-table th,
    .tva-table td,
    .summary-table td {
        padding: 8px;
        text-align: left;
        border-bottom: 1px solid #eee;
        font-size: calc($font_size - 1px);
    }

    .tax-table th:last-child,
    .tax-table td:last-child,
    .tva-table th:last-child,
    .tva-table td:last-child {
        text-align: right;
    }

    .summary-table .label {
        font-weight: bold;
    }

    .summary-table .value {
        text-align: right;
        font-weight: bold;
    }

    .total-row {
        background: #f8f8f8;
        font-weight: bold;
        font-size: calc($font_size + 2px);
    }

    /* Payment Section */
    .payment-details,
    .payment-section {
        background: #f8f8f8;
        padding: 20px;
        margin: 0 60px 30px 0;
        font-size: smaller;
        page-break-inside: avoid;
        break-inside: avoid;
    }

    .payment-grid {
        display: grid;
        grid-template-columns: 150px 1fr;
        gap: 10px;
    }

    .payment-label {
        font-weight: bold;
    }

    .payment-value {
        color: #333;
    }

    .payment-instructions {
        margin-top: 15px;
        font-size: calc($font_size - 2px);
        color: #666;
    }

    .pay-button {
        background: black;
        color: white;
        padding: 12px 24px;
        border: none;
        width: 100%;
        font-size: $font_size;
        font-weight: bold;
        margin-top: 15px;
        cursor: pointer;
    }

    /* Legacy table support */
    .legacy-table {
        display: none; /* Hide legacy tables */
    }

    /* Invoice Footer */
    .invoice-footer {
        margin-top: 30px;
    }

    /* Footer */
    .footer-note,
    .document-footer {
        font-size: calc($font_size - 2px);
        color: #666;
        margin-top: 20px;
        line-height: 1.5;
    }

    .footer-content {
        width: 100%;
    }

    /* Legacy support - hide old elements */
    #header,
    #footer,
    #header-spacer,
    #footer-spacer {
        display: none;
    }

    .entity-label {
        display: none;
    }

    #table-totals {
        display: none;
    }

    /* Utility classes */
    .text-right {
        text-align: right;
    }

    .text-left {
        text-align: left;
    }

    .text-center {
        text-align: center;
    }

    .font-bold {
        font-weight: bold;
    }

    .hidden {
        display: none;
    }

    /* Invoice specific utilities */
    .invoice-products {
        margin: 20px 0;
    }

    .tax-summary-section {
        margin: 30px 0;
    }

    .payment-details {
        margin: 30px 0;
    }

    /* Print optimizations */
    @media print {
        .payment-details {
            page-break-inside: avoid;
        }
        
        .tax-summary-section {
            page-break-inside: avoid;
        }
    }

    /* Stamps and status indicators */
    .stamp,
    .is-paid {
        transform: rotate(12deg);
        color: #555;
        font-size: 3rem;
        font-weight: 700;
        border: 0.25rem solid #555;
        display: inline-block;
        padding: 0.25rem 1rem;
        text-transform: uppercase;
        border-radius: 1rem;
        font-family: 'Courier';
        mix-blend-mode: multiply;
        z-index: 200 !important;
        position: fixed;
        text-align: center;
    }

    .is-paid {
        color: #D23;
        border: 1rem double #D23;
        transform: rotate(-5deg);
        font-size: 6rem;
        font-family: "Open sans", Helvetica, Arial, sans-serif;
        border-radius: 0;
        padding: 0.5rem;
        opacity: 0.2;
        display: $show_paid_stamp;
    }
</style>