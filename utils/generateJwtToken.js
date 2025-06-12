import JWT from 'jsonwebtoken'

export const generateJwtToken = (user) => {
  const token = JWT.sign({_id: user._id,}, process.env.MY_JWT_STRING, {
    expiresIn: '3d',
  });
  return token;
};