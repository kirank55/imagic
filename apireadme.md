# API Deployment Guide - VPS Hosting

This guide provides comprehensive steps to host Node.js API on a VPS.

## Prerequisites

- A VPS (Ubuntu 20.04/22.04 recommended)
- Domain name (optional but recommended)
- SSH access to your VPS

## Step 1: VPS Setup and Security

```bash
# Connect to your VPS
ssh root@your-vps-ip

# Update system packages
sudo apt update && sudo apt upgrade -y

# Create a non-root user (replace 'username' with your desired username)
sudo adduser username
sudo usermod -aG sudo username

# Switch to new user
su - username
```

## Step 2: Install Required Software

```bash
# Install Node.js (using NodeSource repository for latest LTS)
curl -fsSL https://deb.nodesource.com/setup_lts.x | sudo -E bash -
sudo apt-get install -y nodejs

# Verify installation
node --version
npm --version

# Install PM2 (Process Manager)
sudo npm install -g pm2

# Install Nginx (reverse proxy)
sudo apt install nginx -y

# Install Git
sudo apt install git -y
```

## Step 3: Deploy Your Application

```bash
# Clone your repository or upload files
git clone https://github.com/kirank55/imagic.git
cd imagic/apps/api

# Or if uploading manually:
# Create directory: mkdir -p /home/username/api
# Upload your apps/api folder contents to /home/username/api

# Install dependencies
npm install

# Build TypeScript to JavaScript
npm run build

# Create environment file
sudo nano .env
```

Add your environment variables to `.env`:

```bash
PORT=3001
# Add other environment variables your app needs
```

## Step 4: Configure PM2

Create a PM2 ecosystem file:

```bash
nano ecosystem.config.js
```

```javascript
module.exports = {
  apps: [
    {
      name: "imagic-api",
      script: "./dist/server.js",
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: "1G",
      env: {
        NODE_ENV: "production",
        PORT: 3001,
      },
    },
  ],
};
```

Start your application:

```bash
# Start with PM2
pm2 start ecosystem.config.js

# Save PM2 configuration
pm2 save

# Setup PM2 to start on boot
pm2 startup
# Follow the instructions from the output
```

## Step 5: Configure Nginx Reverse Proxy

```bash
# Create Nginx configuration
sudo nano /etc/nginx/sites-available/imagic-api
```

```nginx
server {
    listen 80;
    server_name your-domain.com;  # Replace with your domain or VPS IP

    location / {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

Enable the site:

```bash
# Enable the configuration
sudo ln -s /etc/nginx/sites-available/imagic-api /etc/nginx/sites-enabled/

# Test Nginx configuration
sudo nginx -t

# Restart Nginx
sudo systemctl restart nginx
```

## Step 6: Setup SSL Certificate (Optional but Recommended)

```bash
# Install Certbot
sudo apt install certbot python3-certbot-nginx -y

# Get SSL certificate (replace your-domain.com)
sudo certbot --nginx -d your-domain.com

# Test auto-renewal
sudo certbot renew --dry-run
```

## Step 7: Configure Firewall

```bash
# Setup UFW firewall
sudo ufw enable
sudo ufw allow ssh
sudo ufw allow 'Nginx Full'
sudo ufw status
```

## Step 8: Monitoring and Maintenance

```bash
# Monitor your application
pm2 status
pm2 logs imagic-api
pm2 restart imagic-api

# Monitor system resources
htop
df -h
free -h

# Update your application
cd /path/to/your/api
git pull origin main
npm install
npm run build
pm2 restart imagic-api
```

## Step 9: Environment Variables for Production

Make sure your `.env` file includes all necessary variables:

```bash
PORT=3001
NODE_ENV=production
# Add your specific environment variables
# Database URLs, API keys, etc.
```

## Additional Security Recommendations

1. **SSH Key Authentication**: Disable password authentication
2. **Fail2Ban**: Install to prevent brute force attacks
3. **Regular Updates**: Keep your system and dependencies updated
4. **Backups**: Setup automated backups
5. **Monitoring**: Use services like Uptime Robot or similar

## Troubleshooting Commands

```bash
# Check if your app is running
pm2 status

# Check Nginx status
sudo systemctl status nginx

# Check logs
pm2 logs imagic-api
sudo tail -f /var/log/nginx/error.log

# Check which process is using port 3001
sudo lsof -i :3001
```

Your API should now be accessible at `http://your-domain.com` or `http://your-vps-ip`. The Nginx reverse proxy will forward requests to your Node.js application running on port 3001.
