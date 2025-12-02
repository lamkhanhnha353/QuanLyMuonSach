# Image Upload Fix for Book Management

## Task Overview
Fix the image upload functionality in the book management system so that images are properly uploaded to Cloudinary instead of just creating local URLs.

## Completed Tasks
- [x] Updated frontend `handleFileSelect` method in `StaffSachManagement.vue` to convert selected files to base64 data URLs and upload them to Cloudinary via the backend service
- [x] Updated backend `sach.controller.js` to use `uploadImageFromBase64` instead of `uploadImageFromUrl`
- [x] Modified the uploadImage endpoint to extract base64 data from data URLs (e.g., "data:image/jpeg;base64,...")

## Technical Details
- Frontend: File is converted to base64 using FileReader, then sent to backend via SachService.uploadImage()
- Backend: Receives base64 data URL, extracts the base64 part, and uploads to Cloudinary using uploadImageFromBase64()
- Cloudinary: Images are stored in the "QuanLyMuonSach/sach" folder

## Configuration Requirements
Ensure the following environment variables are set in BACKEND/.env:
- CLOUDINARY_CLOUD_NAME
- CLOUDINARY_API_KEY
- CLOUDINARY_API_SECRET

## Testing
- Select an image file in the book management form
- Verify that the image uploads successfully and displays the Cloudinary URL
- Check that the image is properly saved when creating/updating a book record
