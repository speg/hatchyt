// The router for most of the "main" endpoints.

import express from 'express'

import publish from './publish'
import template from './templates'
import dash from './dash'
import report from './report'
import signups from './signups'
import site from './site'
import auth from '../middleware/authenticate'

const hatchRouter = express.Router()

hatchRouter.post('/track/', site.trackSite)
hatchRouter.post('/sign/', site.signupSite)

hatchRouter.post('/publish/', auth,  publish)
hatchRouter.post('/template/', auth,  template)
hatchRouter.get('/signups/download/', auth, signups.download)
hatchRouter.get('/signups/', auth, signups.main)
hatchRouter.get('/report/', auth,  report)
hatchRouter.get('/',  auth, dash)

export default hatchRouter
