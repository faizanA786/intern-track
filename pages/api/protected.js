import React, { useState } from 'react';

export default function Signup() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  async function handleSubmit(e) {
    e.preventDefault();
    // You would call your API here

    setMessage(`Signed up with email: ${email}`);
    setEmail('');
    setPassword('');
  }

  return (
    <form onSubmit={handleSubmit} style={{ maxWidth: '300px', margin: 'auto' }}>
      <h2>Sign Up</h2>
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={e => setEmail(e.target.value)}
        style={{ display: 'block', width: '100%', padding: '8px', marginBottom: '12px' }}
        required
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={e => setPassword(e.target.value)}
        style={{ display: 'block', width: '100%', padding: '8px', marginBottom: '12px' }}
        required
      />
      <button type="submit" style={{ width: '100%', padding: '10px' }}>Sign Up</button>
      {message && <p>{message}</p>}
    </form>
  );
}
