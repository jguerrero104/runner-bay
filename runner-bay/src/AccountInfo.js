import React from 'react';

function AccountInfo({ email }) {
  return (
    <div>
      <h2>Account Information</h2>
      <p>Email: {email}</p>
      {/* other account information here */}
    </div>
  );
}

export default AccountInfo;
