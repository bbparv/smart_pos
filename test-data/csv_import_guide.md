# CSV Import Testing Guide

## Files Provided

1. **sample_products.csv** - 10 sample products
2. **sample_suppliers.csv** - 5 sample suppliers

---

## How to Test CSV Import

### Step 1: Import Suppliers First
**Important**: You must import suppliers before products because products reference supplier IDs.

1. Go to Manager Panel → Suppliers tab
2. Click "Import CSV" button
3. Select `sample_suppliers.csv`
4. Wait for success message
5. Verify 5 suppliers are added to the table

### Step 2: Import Products
1. Go to Manager Panel → Products tab
2. Click "Import CSV" button
3. Select `sample_products.csv`
4. Wait for success message
5. Verify 10 products are added to the table

---

## CSV File Formats

### Products CSV Format:
```
sku,name,description,cost,price,stock,lowStockThreshold,supplierId
```

**Required Fields**:
- `sku` - Unique product code
- `name` - Product name
- `description` - Product description
- `cost` - Cost price (must be > 0)
- `price` - Selling price (must be > cost)
- `stock` - Current stock quantity (>= 0)
- `lowStockThreshold` - Low stock alert threshold (>= 0)
- `supplierId` - ID of the supplier (must exist in database)

**Example Row**:
```
PROD001,Wireless Mouse,Ergonomic wireless mouse,15.50,29.99,50,10,1
```

---

### Suppliers CSV Format:
```
name,contact,email,phone,address
```

**Required Fields**:
- `name` - Supplier company name
- `contact` - Contact person name
- `email` - Email address (valid format)
- `phone` - 10-digit phone number
- `address` - Full address

**Example Row**:
```
Tech Supplies Co,John Smith,john@techsupplies.com,9876543210,123 Tech Street Mumbai
```

---

## Important Notes

### Supplier IDs in Products CSV
The `supplierId` in products CSV refers to existing suppliers:
- `1` = First supplier in your database
- `2` = Second supplier in your database
- `3` = Third supplier in your database

**If you're testing on a fresh database**:
1. Import suppliers first
2. Check the supplier IDs in the Suppliers table
3. Update the `supplierId` column in products CSV if needed

### Common Issues

**Issue**: "Supplier not found" error when importing products
**Solution**: Make sure suppliers are imported first and supplier IDs match

**Issue**: "Validation error" when importing
**Solution**: Check that:
- Cost and price are > 0
- Price is greater than cost
- Phone numbers are 10 digits
- Email format is valid

**Issue**: Duplicate SKU error
**Solution**: Each product SKU must be unique

---

## Sample Data Overview

### Suppliers (5):
1. Tech Supplies Co - Electronics and peripherals
2. Office Essentials Ltd - Office supplies
3. Electronics Hub - Consumer electronics
4. Gadget World - Tech gadgets
5. Smart Devices Inc - Smart devices

### Products (10):
1. Wireless Mouse - Tech Supplies Co
2. USB Keyboard - Tech Supplies Co
3. HDMI Cable 2m - Office Essentials Ltd
4. Laptop Stand - Office Essentials Ltd
5. Webcam HD - Tech Supplies Co
6. USB-C Hub - Electronics Hub
7. Desk Lamp LED - Electronics Hub
8. Phone Holder - Office Essentials Ltd
9. Cable Organizer - Electronics Hub
10. Monitor Screen Cleaner - Office Essentials Ltd

---

## Testing Checklist

- [ ] Download both CSV files
- [ ] Import suppliers first
- [ ] Verify 5 suppliers appear in table
- [ ] Import products
- [ ] Verify 10 products appear in table
- [ ] Check that products show correct supplier names
- [ ] Try exporting to verify data integrity
- [ ] Test with modified CSV (add/remove rows)

---

## Creating Your Own CSV Files

You can create custom CSV files using:
- Microsoft Excel (Save As → CSV)
- Google Sheets (File → Download → CSV)
- Any text editor (save with .csv extension)

**Important**: 
- First row must be the header with exact column names
- Use commas to separate values
- Don't use commas in the data itself (or use quotes)
- Save with UTF-8 encoding
