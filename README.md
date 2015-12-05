# Hatchyt

## Hatching your next idea

Hatchyt is a tool to help you quickly build static pages 
with built in tracking and contact aquisition.

### Features

  * self serving mode
  * Create / Edit / Delete and Publish sites to static HTML
  * 3rd party libraries - jQuery, Bootstrap, React, and more
  * automatic visitor tracking
  * automatic contact aquisition

#### Coming Soon
  * open graph support
  * custom templates
  * plugins
  * media storage

# Installation

Serving pages with ngninx is strongly recommend.
You will need to have already set up your DNS to point to your server.

Don't forget to create a DNS entry for your admin subdomain, or use a wildcard.

1. `npm install -g hatchyt`
2. Create a directory to work out of: `mkdir /sites && cd /sites`
3. Start hatchyt from your new directory: `hatchyt start`
4. Follow the prompts to choose an admin subdomain and credentials.
5. Optional:
  1. Follow the instructions in the prompt to link the `.hatchyt/hatchyt.conf` to your ngninx `sites-enabled` directory.
  2. Reload ngninx configuration `sudo service ngninx reload`
