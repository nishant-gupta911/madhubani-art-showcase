import bcrypt from 'bcryptjs';
import readline from 'readline';

async function main() {
  let password = process.argv[2];

  if (!password) {
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });
    password = await new Promise<string>((resolve) => {
      rl.question('Enter new admin password: ', (ans) => {
        rl.close();
        resolve(ans.trim());
      });
    });
  }

  if (!password || password.length < 8) {
    console.error('Error: Password must be at least 8 characters long.');
    process.exit(1);
  }

  const saltRounds = 12;
  const hash = await bcrypt.hash(password, saltRounds);

  console.log('\n=== ADMIN PASSWORD HASH GENERATED ===');
  console.log(`Add this line to your .env.local file:`);
  console.log(`ADMIN_PASSWORD_HASH="${hash}"`);
  console.log('=====================================\n');
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
