exports.registerUser = (req, res) => {
  const { name, email, password } = req.body;
  console.log('User registered:', name, email);
  res.send({ message: 'User registered successfully!' });
};

exports.loginUser = (req, res) => {
  const { email, password } = req.body;
  console.log('User login attempt:', email);
  res.send({ message: 'Login successful!' });
};
