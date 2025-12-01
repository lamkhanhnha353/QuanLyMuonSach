# Cập nhật tính năng Mượn Sách với chọn số lượng

## Tóm tắt thay đổi

Hệ thống đã được cập nhật để cho phép độc giả chọn số lượng sách mượn với các giới hạn hợp lý.

## Tính năng mới

### 1. Modal chọn số lượng mượn
- Hiển thị số quyển sách còn lại
- Hiển thị số quyển độc giả đã mượn
- Cho phép chọn số lượng từ 1 đến số tối đa

### 2. Logic giới hạn
- **Max 3 quyển mỗi lần**: Độc giả chỉ được mượn tối đa 3 quyển trong 1 lần
- **Phù hợp với sách còn lại**: 
  - Nếu sách còn 1 quyển → Max mượn 1 quyển
  - Nếu sách còn 2 quyển → Max mượn 2 quyển
  - Nếu sách còn 3+ quyển → Max mượn 3 quyển
- **Max 10 quyển tổng cộng**: Độc giả không được vượt quá 10 quyển mượn cùng lúc
- **Kiểm tra khi duyệt**: Backend xác thực các điều kiện này trước khi duyệt

## Chi tiết thay đổi

### Frontend (BookDetail.vue)

#### State mới thêm:
```javascript
showBorrowModal: false,      // Hiển thị modal
borrowQuantity: 1,           // Số lượng chọn
userBorrowCount: 0,          // Số sách đã mượn
borrowError: "",             // Lỗi validation
borrowWarning: ""            // Cảnh báo
```

#### Computed properties mới:
```javascript
maxBorrowQuantity() {
  // Tính toán số lượng tối đa dựa trên:
  // 1. Max 3 quyển mỗi lần
  // 2. Số sách còn lại
  // 3. Hạn mức còn lại (10 - số đã mượn)
}
```

#### Methods mới:
- `fetchUserBorrowCount()` - Lấy số sách người dùng đã mượn
- `validateQuantity()` - Kiểm tra tính hợp lệ của số lượng chọn
- `confirmBorrow()` - Xác nhận mượn với validation

#### Modal UI:
- Cho phép chọn số lượng bằng +/- buttons hoặc input trực tiếp
- Hiển thị cảnh báo nếu vượt hạn mức
- Hiển thị error message nếu validation thất bại

### Backend (muonsach.service.js)

#### Validation trong create method:
1. Kiểm tra số lượng hợp lệ (1-3)
2. Kiểm tra sách còn đủ số lượng
3. Kiểm tra độc giả không vượt hạn mức 10 quyển

#### Cập nhật update method:
- Khi duyệt: Trừ `soLuong` quyển từ kho
- Khi trả: Cộng `soLuong` quyển lại vào kho

#### Cập nhật delete method:
- Khi xóa phiếu: Trả lại `soLuong` quyển vào kho

## Luồng mượn sách

1. Độc giả bấm "Mượn sách" trên trang chi tiết
2. Modal hiển thị:
   - Số quyển sách còn lại
   - Số quyển đã mượn
   - Selector để chọn số lượng (1-max)
3. Độc giả chọn số lượng và xác nhận
4. Frontend gửi request với `soLuong`
5. Backend xác thực:
   - Max 3 quyển
   - Sách còn đủ số lượng
   - Không vượt 10 quyển tổng cộng
6. Nếu valid: Tạo phiếu mượn (chờ duyệt)
7. Nhân viên duyệt: Hệ thống tự động trừ số lượng từ kho

## Error messages

- "Số lượng mượn phải lớn hơn 0"
- "Mỗi lần chỉ được mượn tối đa 3 quyển"
- "Chỉ còn X quyển, không thể mượn Y quyển"
- "Số sách mượn sẽ vượt hạn mức 10 quyển"
- "Bạn đã mượn X quyển. Không thể vượt quá hạn mức 10 quyển"

## Database

Trường mới thêm vào collection THEODOIMUONSACH:
```javascript
{
  ...
  soLuong: 1  // Số quyển mượn (default: 1 nếu không có)
}
```

## Backward compatibility

Hệ thống hỗ trợ các phiếu cũ không có trường `soLuong`:
- Nếu không có: Mặc định là 1 quyển
- Khi duyệt/trả: Sử dụng giá trị này để cập nhật kho

## Testing checklist

- [ ] Mượn 1 quyển - Sách có 5 quyển
- [ ] Mượn 2 quyển - Sách có 2 quyển
- [ ] Thử mượn 4 quyển - Phải báo lỗi (max 3)
- [ ] Độc giả đã mượn 9 quyển, thử mượn 2 quyển - Phải báo lỗi
- [ ] Độc giả đã mượn 8 quyển, mượn 2 quyển - Thành công
- [ ] Sách chỉ còn 1 quyển - Max selector phải là 1
- [ ] Xóa phiếu đang mượn - Sách phải được trả lại đầy đủ
- [ ] Nhân viên từ chối phiếu - Sách phải được trả lại đầy đủ
