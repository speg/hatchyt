export default function (ctx) {

return `log_format hatchyt '[$time_local] $host :: $server_name :: $uri :: "$request" $status';

server {
    listen 80 default_server;
    access_log ${ctx.root}/.hatchyt/access.log hatchyt;
    index index.html;

    error_page 404 /404.html;

    location = /404.html {
        root ${ctx.root}/.hatchyt;
        internal;
    }

    location @node {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    location /track {
        try_files /noop @node;
    }

    location /sign {
        try_files /noop @node;
    }


    location / {
        root ${ctx.root}/output/$http_host;
    }
}

server {
    server_name ${ctx.admin}.*;
    listen 80;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
`
}