function generateToken(length = 24) {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let token = '';
  for (let i = 0; i < length; i++) {
    token += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return token;
}

export let applications: any[] = [];

export function addApplication(appData: any): { id: number, token: string } {
  const id = Date.now();
  const token = generateToken();
  const appWithId = { ...appData, id, token };
  applications.push(appWithId);
  return { id, token };
}

export { generateToken }; 