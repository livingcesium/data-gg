require('dotenv').config()
const port = process.env.PORT || 9000
const express = require('express')
const User = require('./User')
const app = express()
const cors = require('cors')
const multer = require('multer');
const upload = multer({ storage: multer.memoryStorage() })

const File = require('./File.js')
const Tag = require('./Tag.js')
const Tagged = require('./Tagged.js')
const Transaction = require('./Transaction.js')
const { default: mongoose } = require('mongoose')


const middlewares = {
    empty: upload.none(),   //(req, res, next) => next(),
    uploadSingle: upload.single('file'),
}

const endpoints = {
    get: {
        getUser: {
            handler: async (req, res) => {
                const username = req.query.username
                const password = req.query.password
                try {
                    const user = await User.findOne({ username, password })
                    res.send(user)
                } catch (error) {
                    console.log(error)
                    res.status(500).send(error)
                }
            }
        },
        getUsers: {
            handler: async (req, res) => {
                try {
                    const userList = await User.find({}, {firstname:1, lastname:1});
                    console.log(userList)
                    res.send(userList)
                }
                catch (error) {
                    res.status(500).send(error)
                }
            }
        },
        getFiles: {
            handler: async (req, res) => {
                try {
                    const files = await File.find()
                    let responseDetails = []
                    for (const file of files) {
                        const uploader = await User.findById(file.uploader_id)
                        responseDetails.push({
                            uploader_details: {display_name: uploader.firstname + ' ' + uploader.lastname, _id: uploader._id},
                            file_name: file.file_name,
                            file_size: file.file_size,
                            timestamp: file.timestamp,
                            data_buffer: file.data
                        })
                    }
                    res.send(responseDetails)
                }
                catch (error) {
                    res.status(500).send(error)
                }
            }
        },
        getTag: {
            handler: async (req, res) => {
                try {
                    const tag = await Tag.findOne(req.query)
                    res.send(tag)
                } catch (error) {
                    console.log(error)
                    res.status(500).send(error)
                }
            }    
        },
        getTags: {
            handler: async (req, res) => {
                try {
                    const tags = await Tag.find(req.query)
                    res.send(tags)
                } catch (error) {
                    console.log(error)
                    res.status(500).send(error)
                }
            }
        },
        searchFiles: {
            handler: async (req, res) => {
                try {
                    await Tagged.find().populate('tag_id')
                    const matches = {}
                    console.log(req.query.tagPairs)
                    for (const {tag_id, value} of req.query.tagPairs) {
                        var match
                        if(!tag_id.name){
                            match = await Tagged.find().populate('file_id', '-data').populate('tag_id')
                        } else {
                            mongoose.set('debug', true)
                            const foundTag = await Tag.findOne({name: tag_id.name})
                            match = await Tagged.find({'tag_id': foundTag._id, value: value }).populate('file_id', '-data').populate('tag_id')
                            console.log(match)
                            mongoose.set('debug', false)
                        }
                        for (const m of match) {
                            const fileId = m.file_id._id
                            if(!matches[fileId]){
                                console.log(m.file_id)
                                const uploader = await User.findById(m.file_id.uploader_id)
                                console.log("!!!", uploader)
                                matches[fileId] = {file: {...m.file_id.toObject(), uploader: {username: uploader.username, _id: m.file_id.uploader_id}}, tags: {}}
                            }
                            if(m.tag_id.name){
                                if(matches[fileId].tags)
                                    matches[fileId].tags = {...matches[fileId].tags,
                                        [m.tag_id.name]: {tag: m.tag_id.toObject(), value: m.value, _id: m._id},
                                    }
                                else matches[fileId].tags = {[m.tag_id.name]: {tag: m.tag_id.toObject(), value: m.value, _id: m._id}}
                            }
                            
                            if (typeof matches[fileId].tags["name"] === undefined){
                                const nameTag = await Tagged.findOne({ 'tag_id.name': "name", 'file_id._id': fileId})
                                console.log(nameTag)
                                matches[fileId].tags["name"] = {tag: nameTag.tag_id.toObject(), value: nameTag.value, _id: nameTag._id}
                            }
                
                        }
                            //matches.push(...taggings.filter(t => t.tag_id.name === tag_id.name && t.value === value).populate('file_id')) // TODO: make second condition changeable to >, <, etc.
                    }

                    console.log(matches)
                    res.send(matches)
                } catch (error) {
                    console.log(error)
                    res.status(500).send
                }
            }
        },
        getFileData: {
            handler: async (req, res) => {
                try {
                    const file = await File.findById(req.params.file_id)
                    res.set({
                        'Content-Type': file.mimetype,
                        'Content-Disposition': `attachment; filename=${file.file_name}`,
                    })

                    await Transaction.create({file_id: file._id, user_id: req.params.recipient_id})
                    res.send(file.data)
                } catch (error) {
                    console.log(error)
                    res.status(500).send(error)
                }
            }, urlParams: 'file_id/:recipient_id'
        },
        getTransactions: {
            handler: async (req, res) => {
                try {
                    const transactions = await Transaction.find(req.params).populate('user_id')
                    res.send(transactions)
                } catch (error) {
                    console.log(error)
                    res.status(500).send(error)
                }
            }
        }
    },
    post: {
        createUser: {
            handler: async (req, res) => {
                try {
                    console.log(req.body)
                    const user = new User(req.body)
                    await user.save()
                    res.send(user)
                } catch (error) {
                    console.log(error)
                    res.status(500).send(error)
                }
            }
        },
        uploadFile: {
            handler: async (req, res) => {
                try {
                    const { originalname, size, buffer } = req.file;
                    const file = new File({
                        file_name: originalname,
                        file_size: size,
                        data: buffer,
                        uploader_id: req.params.uploader_id
                    });
                    await file.save();

                    await Transaction.create({up: true, file_id: file._id, user_id: req.params.uploader_id})

                    res.send(file);
                } catch (error) {
                    console.error(error);
                    res.status(500).send('Error uploading file');
                }
            }, middleware: middlewares.uploadSingle, urlParams: 'uploader_id'
        },
        createTag: {
            handler: async (req, res) => {
                if(!req.body.tags)
                    try {
                        const tag = new Tag(req.body)
                        await tag.save()
                        res.send(tag)
                    } catch (error) {
                        console.log(error)
                        res.status(500).send(error)
                    } 
                else 
                    try {
                        const tags = JSON.parse(req.body.tags)
                        const tagList = tags.map(tag => new Tag(tag))
                        await Tag.insertMany(tagList)
                        res.send(tagList)
                    } catch (error) {
                        console.log(error)
                        res.status(500).send(error)
                    }
            }
        },
        tagFile: {
            handler: async (req, res) => {
                if(!req.body.taggings) 
                    try {
                        console.log(req.body)
                        const tagged = new Tagged(req.body)
                        await tagged.save()
                        res.send(tagged)
                    } catch (error) {
                        console.log(error)
                        res.status(500).send(error)
                    } 
                else 
                    try {
                        const taggings = JSON.parse(req.body.taggings)
                        const taggedList = taggings.map(tagging => new Tagged(tagging))
                        await Tagged.insertMany(taggedList)
                        res.send(taggedList)
                    } catch (error) {
                        console.log(error)
                        res.status(500).send(error)
                    }
            }
        },
    },
    
}


const start = () => {
    app.use(express.json())
    app.use(cors())
    app.listen(port, () => {
        console.log(`Server started on port ${port}`)
    })
}

const connectDatabase = () => {
    const mongoose = require('mongoose')
    mongoose.connect(process.env.MONGO_URI)
    const database = mongoose.connection

    database.on('error', (error) => console.log(error))
    database.once('connected', () => console.log('Database Connected'))
}

const createEndpoints = () => {
    for (const method in endpoints) {
        for (const name in endpoints[method]) {
            // app[ get/post ]() == app.get()/post()
            const endpoint = endpoints[method][name]
            const urlParams = endpoint.urlParams ? `/:${endpoint.urlParams}` : ''
            app[method](`/${name}${urlParams}`, endpoint.middleware ?? middlewares.empty, endpoint.handler)
        }
    }
}

start()
connectDatabase()
createEndpoints()