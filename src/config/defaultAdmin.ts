export const defaultAdmins = [
  {
    email: '227makemoney@gmail.com',
    password: 'admin123',
    name: 'Administrateur Principal',
    role: 'admin' as const,
    isPremium: true,
    isActive: true,
    companyInfo: {
      name: 'G-Finance',
      address: 'Niamey, Niger',
      phone: '+227 XX XX XX XX',
      email: 'contact@g-finance.com'
    }
  },
  {
    email: 'contact@gstartup.pro',
    password: 'Nigerien2024',
    name: 'Administrateur G-Startup',
    role: 'admin' as const,
    isPremium: true,
    isActive: true,
    companyInfo: {
      name: 'G-Finance',
      address: 'Niamey, Niger',
      phone: '+227 XX XX XX XX',
      email: 'contact@gstartup.pro'
    }
  },
  {
    email: 'support@gtransfert.pro',
    password: 'Papuscool1@1',
    name: 'Administrateur Support',
    role: 'admin' as const,
    isPremium: true,
    isActive: true,
    companyInfo: {
      name: 'G-Finance',
      address: 'Niamey, Niger',
      phone: '+227 XX XX XX XX',
      email: 'support@gtransfert.pro'
    }
  }
];