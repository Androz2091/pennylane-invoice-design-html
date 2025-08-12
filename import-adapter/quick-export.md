### Quick export Pennylane

Pennylane does not let you select all the invoices at once, so use this snippet to select all invoices and then export them.

```javascript
for(const el of document.querySelectorAll("button[value='false']")) {
    el.click();
}
```