module.exports={
    facebookLogin: async (req, res) => {
        const { accessToken } = req.body;
    
        if (!accessToken) {
          throw new ErrorResponse(400, 'Access token is required');
        }
    
        // Kiểm tra Access Token bằng cách gọi Facebook Graph API
        let response = await axios.get(
          `https://graph.facebook.com/me?access_token=${accessToken}&fields=id,name,email`,
        );
        const {id,email,name}=response.data
        if (!id) {
            throw new ErrorResponse(400, 'Đăng nhập thất bại');
          }
          
          // Xử lý: tìm hoặc tạo người dùng trong cơ sở dữ liệu
          // Lưu thông tin người dùng, hoặc trả về token JWT để xác thực 
          const account = await accountModel.findOne({ facebookId: id });
          
          if (!account) {
            await accountModel.create({
              fullname: name, 
              username: email,
              email,
              is_active: true,
              facebookId: id,
            });                                                                  
          }
          
          return res.status(200).json(account);
      }
}