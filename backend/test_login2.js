import axios from 'axios';

async function test() {
  try {
    const email = 'new_login_test_10@gmail.com';
    const password = 'Password@123!';
    
    console.log("Registering...");
    await axios.post('http://localhost:5001/api/auth/register', {
      email, password, name: 'Test User', role: 'owner'
    });
    console.log("Registration complete.");
    
    console.log("Attempting Login...");
    const res = await axios.post('http://localhost:5001/api/auth/login', {
      email, password
    });
    console.log("Login Success!");
  } catch (err) {
    console.error("FAILED >>", JSON.stringify(err.response?.data || err.message));
  }
}
test();
