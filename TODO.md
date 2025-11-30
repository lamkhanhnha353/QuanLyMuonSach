# TODO: Implement Borrow Book Feature

## Overview
Implement the borrow book feature where readers can request to borrow a book from the BookDetail page, creating a request that staff can approve.

## Steps
- [x] Update BookDetail.vue borrowBook method to send borrow request via API
- [x] Add success/error handling and user feedback in BookDetail.vue
- [x] Ensure borrow button is only enabled for logged-in readers and available books
- [x] Update MuonSachService to decrement book quantity only when staff approves (status "đã duyệt")
- [ ] Test the borrow request creation and staff approval flow

## Dependent Files
- frontend/src/views/BookDetail.vue
- frontend/src/services/muonsach.service.js (if modifications needed)

## Followup
- Run frontend and backend
- Test borrow request from BookDetail
- Verify request appears in StaffMuonSachManagement for approval
- Check book quantity decrement on approval
