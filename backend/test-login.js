import axios from 'axios';

async function test() {
  try {
    const email = 'unique_tester_abc123499@gmail.com';
    const password = 'Password@123';
    
    console.log("Registering...");
    const regRes = await axios.post('http://localhost:5001/api/auth/register', {
      email, password, name: 'Test User', role: 'owner'
    });
    console.log("Registration complete.", regRes.data);
    
    console.log("Attempting Login...");
    const res = await axios.post('http://localhost:5001/api/auth/login', {
      email, password
    });
    console.log("Login Success!", res.data);
  } catch (err) {
    if (err.response) {
       console.error("FAILED HTTP ERROR:", err.response.status, err.response.data);
    } else {
       console.error("FAILED OTHER:", err.message);
    }
  }
}

test();
