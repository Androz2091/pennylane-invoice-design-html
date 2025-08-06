<div id="body">
    <section class="invoice-details">
        <div class="invoice-left">
            <div class="section-title">$entity_label</div>
            <div class="detail-row">
                <div class="detail-label">Numéro</div>
                <div class="detail-value">$number</div>
            </div>
            <div class="detail-row">
                <div class="detail-label">Date d'émission</div>
                <div class="detail-value">$date</div>
            </div>
            <div class="detail-row">
                <div class="detail-label">Date d'échéance</div>
                <div class="detail-value">$due_date</div>
            </div>
            <div class="detail-row">
                <div class="detail-label">Type de vente</div>
                <div class="detail-value">Services</div>
            </div>
        </div>
        <div class="invoice-right">
            <div class="label">Client ou Cliente</div>
            <div class="party-name">$client.name</div>
            <div class="client-address">$client.address1</div>
            <div class="client-location">$client.city_state_postal - $client.country</div>
        </div>
    </section>

    <section class="invoice-products">
        <ninja>
            {% if invoices is defined and invoices is not empty %}
            {% set invoice = invoices | first %}

            <table class="product-table">
                <thead>
                    <tr>
                        <th>Produit</th>
                        <th>Quantité</th>
                        <th>Prix</th>
                        <th>Total</th>
                    </tr>
                </thead>
                <tbody>
                    {% for item in invoice.line_items %}
                    <tr>
                        {% if not (item.quantity == false and item.cost <= '0.001' ) %}
                        <td class="item-key">{{ item.product_key }}</td>
                        <td class="centered">{{ item.quantity }}</td>
                        <td class="centered currency">{{ item.cost }}</td>
                        <td class="centered currency">{{ item.line_total }}</td>
                        {% endif %}
                    </tr>
                    {% if item.notes %}
                    {% set notes = item.notes | split('\n') %}
                    {% for note in notes %}
                    <tr class="note-row">
                        <td colspan="4" class="notes{% if loop.last %} last-note{% endif %}">
                            <span>{{ note | trim }}</span>
                        </td>
                    </tr>
                    {% endfor %}
                    {% endif %}
                    {% endfor %}
                </tbody>
            </table>
            {% endif %}
        </ninja>
    </section>
    
    <!-- Legacy table placeholders -->
    <table id="task-table" class="legacy-table" cellspacing="0" data-ref="table"></table>
    <table id="delivery-note-table" class="legacy-table" cellspacing="0" data-ref="table"></table>

    <section class="tax-summary-section">
        <div class="tax-details">
            <div class="section-title">Détails TVA</div>
            <table class="tax-table">
                <thead>
                    <tr>
                        <th>Taux</th>
                        <th>Montant TVA</th>
                        <th>Base HT</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>N/A</td>
                        <td>N/A</td>
                        <td>$total</td>
                    </tr>
                </tbody>
            </table>
        </div>
        <div class="invoice-summary">
            <div class="section-title">Récapitulatif</div>
            <table class="summary-table">
                <tr>
                    <td class="label">Total HT</td>
                    <td class="value">$subtotal</td>
                </tr>
                <tr>
                    <td class="label">Total TVA</td>
                    <td class="value">N/A</td>
                </tr>
                <tr class="total-row">
                    <td class="label">Total TTC</td>
                    <td class="value">$total</td>
                </tr>
            </table>
            <div class="pay-button">
                <a href="$payment_url">Payer maintenant</a>
            </div>
        </div>
    </section>

    <section class="payment-details">
        <div class="section-title">Paiement</div>
        <div class="payment-grid">
            <div class="payment-label">Moyen de paiement</div>
            <div class="payment-value">Virement / Carte de crédit</div>

            <div class="payment-label">Établissement</div>
            <div class="payment-value">REV</div>

            <div class="payment-label">IBAN</div>
            <div class="payment-value">$company1</div>

            <div class="payment-label">BIC</div>
            <div class="payment-value">REVOFRP2</div>

            <div class="payment-label">Référence</div>
            <div class="payment-value">$number</div>
        </div>

        <div class="payment-instructions">
            Merci d'inclure la référence dans le libellé de votre virement pour que votre paiement soit correctement
            identifié.
        </div>
    </section>

    <footer class="invoice-footer">
        <div class="footer-note">
            $entity_footer
        </div>
    </footer>
</div>
