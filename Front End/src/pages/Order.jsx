import React from 'react';

const Order = () => {
    return (
        <section>
            <div className="bg-gray-100 min-h-screen mt-5">
            <div className="max-w-4xl mx-auto p-4 mt-16">
                <h1 className="text-2xl font-bold mb-4">My Orders</h1>
                
                <div className="bg-white p-4 rounded-lg shadow mb-4">
                    <h2 className="text-lg font-semibold">1. 234234234234 09/09/2023</h2>
                    <p className="text-gray-600">Áo Polo Cổ Bẻ Tay Ngắn Sợi Nhân Tạo Thoáng Mát Trơn Dáng Vừa Đơn Giản Gu Tối Giản M19 Vol 23 / Xanh Đen / XL ... và 2 sản phẩm khác</p>
                    <p className="mt-2">Tổng hóa đơn: 244,000 đ / Thành tiền: 244,000 đ</p>
                    <p className="mt-1">Tình trạng đơn hàng: <span className="bg-yellow-200 px-2 py-1 rounded">Đã mua tại Cửa hàng</span></p>
                    <button className="mt-2 bg-blue-200 text-blue-800 px-4 py-2 rounded">Xem chi tiết</button>
                </div>

                <div className="bg-white p-4 rounded-lg shadow mb-4">
                    <h2 className="text-lg font-semibold">2. 234234234 ngày 26/05/2023 (- 130,000 đ)</h2>
                    <p className="text-gray-600">Áo Thun Cổ Tròn Y Nguyên Bản 18+ Ver81 / Đen, XL</p>
                    <p className="mt-2">Tổng hóa đơn: 257,000 đ / Thành tiền: 127,000 đ</p>
                    <p className="mt-1">Tình trạng đơn hàng: <span className="bg-yellow-200 px-2 py-1 rounded">Đơn hàng đã hủy</span></p>
                    <button className="mt-2 bg-blue-200 text-blue-800 px-4 py-2 rounded">Xem chi tiết</button>
                </div>
            </div>
        </div>
        </section>
    );
};

export default Order;