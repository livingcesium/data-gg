require('dotenv').config()
const port = process.env.PORT || 9000
const express = require('express')
const User = require('./User')
const app = express()
const cors = require('cors')
const multer = require('multer');
const upload = multer({ dest: 'uploads/' })

const File = require('./File.js')



const middlewares = {
    empty: (req, res, next) => next(),
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
        getResults: {
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
                        uploader_id: req.body.uploader_id
                    });
                    await file.save();
                    res.send('File uploaded successfully');
                } catch (error) {
                    console.error(error);
                    res.status(500).send('Error uploading file');
                }
            }, middleware: middlewares.uploadSingle
        }
    }
    
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
            app[method](`/${name}`, endpoint.middleware ?? middlewares.empty, endpoint.handler)
        }
    }
}

start()
connectDatabase()
createEndpoints()