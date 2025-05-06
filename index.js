const express = require('express');
const app = express();
const cors = require('cors');

const { MongoClient, ServerApiVersion } = require('mongodb');
const ObjectId = require('mongodb').ObjectId;

const SSLCommerzPayment = require('sslcommerz-lts')

require('dotenv').config()
app.use(cors(), express.json())

const port = process.env.PORT || 5000;

const store_id = 'skill6284b7526a3cf'
const store_passwd = 'skill6284b7526a3cf@ssl'
const is_live = false

const sslcz = new SSLCommerzPayment(store_id, store_passwd, is_live)

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.ohxhr.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;

const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

app.get('/', (req, res) => {
    res.json({
        code: 200,
        message: "Welcome to the Backend Server!",
        status: true
    })
})

client.connect(err => {
    const usersCollection = client.db("autoBooking").collection("users");
    const categoriesCollection = client.db("autoBooking").collection("categories");
    const servicesCollection = client.db("autoBooking").collection("services");
    const staffsCollection = client.db("autoBooking").collection("staffs");
    const slotsCollection = client.db("autoBooking").collection("slots");
    const paymentCollection = client.db("autoBooking").collection("payments");
    const reviewsCollection = client.db("autoBooking").collection("reviews");

    // login
    app.post('/login', async (req, res) => {
        const { email, password } = req.body;

        const user = await usersCollection.findOne({ email: email.toLowerCase(), password })

        user ?
            res.send({
                message: "Successfully Logged In!",
                status: true,
                user
            })
            :
            res.send({
                message: "Your Email and Password Doesn't match!",
                status: false
            })
    })

    // Create New User
    app.post('/user', async (req, res) => {
        const user = req.body;

        await usersCollection.findOne({ email: req.body.email }, (err, result) => {
            err && res.send({
                status: false,
                message: 'An Error Occurred. Please try again later!',
            })
            result ?
                res.send({
                    status: false,
                    message: 'An User has been created with this email. Please try again with another email!'
                }) :
                usersCollection.insertOne(user, (err, result) => {
                    err && res.send({
                        status: false,
                        message: 'An Error Occurred. Please try again later!',
                    })
                    result && res.send({
                        status: true,
                        message: 'User Created Successfully!',
                        user
                    });
                });
        });
    })

    // Get Single User by id
    app.get('/user/:id', async (req, res) => {
        const id = req.params.id;

        try {
            const user = await usersCollection.findOne({ _id: ObjectId(id) })
            user &&
                res.send({
                    status: true,
                    user
                })
        }
        catch {
            res.send({
                status: false,
                message: "User Id doesn't match!"
            })
        }
    })

    // Update User By Id
    app.patch('/user/:id', async (req, res) => {
        await usersCollection.updateOne(
            {
                _id: ObjectId(req.params.id),
            },
            {
                $set: req.body
            },
            (err, result) => {
                err &&
                    res.send({
                        status: false,
                        message: "An Error Occurred while Updating the user information. Please try again later!"
                    });
                result &&
                    res.send({
                        status: true,
                        message: "Your User Information updated successfully!"
                    });
            }
        )
    })

    //   Get all users
    app.get('/users', async (req, res) => {

        try {
            const users = await usersCollection.find({}).toArray();
            users.length > 0 ?
                res.send({
                    status: true,
                    users,
                    message: 'User information fetched successfully'
                })
                :
                res.send({
                    status: false,
                    users,
                    message: 'No users were found'
                })
        }
        catch {
            res.send({
                status: false,
                message: "An Error occurred. Please try again later!"
            })
        }
    })

    // Delete User By Id
    app.delete('/user/:id', async (req, res) => {
        await usersCollection.deleteOne({ _id: ObjectId(req.params.id) }, (err, result) => {
            err &&
                res.send({
                    status: false,
                    message: "An Error Occurred while Deleting the user information. Please try again later!"
                });
            result &&
                res.send({
                    status: true,
                    message: "User Deleted !"
                });
        }
        )
    })

    // Create Category
    app.post('/category', async (req, res) => {
        const category = req.body;

        await categoriesCollection.insertOne(category, (err, result) => {
            err && res.send({
                status: false,
                message: 'There is an error adding new category. Please try again later !',
            })
            result && res.send({
                status: true,
                message: 'Category Added Successfully'
            });
        });
    })

    // get all categories
    app.get('/categories', async (req, res) => {
        await categoriesCollection.find().toArray((err, categories) => {
            err && res.send({
                status: false,
                message: "There is an error getting categories. Please try again later!"
            })
            res.send({
                status: true,
                categories
            });
        })
    })

    // Get Single Category by id
    app.get('/category/:id', async (req, res) => {
        const id = req.params.id;

        try {
            const category = await categoriesCollection.findOne({ _id: ObjectId(id) })
            category &&
                res.send({
                    status: true,
                    category
                })
        }
        catch {
            res.send({
                status: false,
                message: "Category Id doesn't match!"
            })
        }
    })

    // Update Category By Id
    app.patch('/category/:id', async (req, res) => {
        await categoriesCollection.updateOne(
            {
                _id: ObjectId(req.params.id),
            },
            {
                $set: req.body
            },
            (err, result) => {
                err &&
                    res.send({
                        status: false,
                        message: "An Error Occurred while Updating the user information. Please try again later!"
                    });
                result &&
                    res.send({
                        status: true,
                        message: "Your Category Information updated successfully!"
                    });
            }
        )
    })

    // Delete Category By Id
    app.delete('/category/:id', async (req, res) => {
        await categoriesCollection.deleteOne({ _id: ObjectId(req.params.id) }, (err, result) => {
            err &&
                res.send({
                    status: false,
                    message: "An Error Occurred while Deleting the category information. Please try again later!"
                });
            result &&
                res.send({
                    status: true,
                    message: "Category Deleted!"
                });
        }
        )
    })

    // Create Service
    app.post('/service', async (req, res) => {
        const service = req.body;

        await servicesCollection.insertOne(service, (err, result) => {
            err && res.send({
                status: false,
                message: 'There is an error adding new service. Please try again later !',
            })
            result && res.send({
                status: true,
                message: 'Service Added Successfully'
            });
        });
    })

    // get all categories
    app.get('/services', async (req, res) => {
        await servicesCollection.find().toArray((err, services) => {
            err && res.send({
                status: false,
                message: "There is an error getting services. Please try again later!"
            })
            res.send({
                status: true,
                services
            });
        })
    })

    // Get Single Service by id
    app.get('/service/:id', async (req, res) => {
        const id = req.params.id;

        try {
            const service = await servicesCollection.findOne({ _id: ObjectId(id) })
            service &&
                res.send({
                    status: true,
                    service
                })
        }
        catch {
            res.send({
                status: false,
                message: "service Id doesn't match!"
            })
        }
    })

    // Update Service By Id
    app.patch('/service/:id', async (req, res) => {
        await servicesCollection.updateOne(
            {
                _id: ObjectId(req.params.id),
            },
            {
                $set: req.body
            },
            (err, result) => {
                err &&
                    res.send({
                        status: false,
                        message: "An Error Occurred while Updating the service information. Please try again later!"
                    });
                result &&
                    res.send({
                        status: true,
                        message: "Your Service Information updated successfully!"
                    });
            }
        )
    })

    // Delete Service By Id
    app.delete('/service/:id', async (req, res) => {
        await servicesCollection.deleteOne({ _id: ObjectId(req.params.id) }, (err, result) => {
            err &&
                res.send({
                    status: false,
                    message: "An Error Occurred while Deleting the Service information. Please try again later!"
                });
            result &&
                res.send({
                    status: true,
                    message: "Service Deleted!"
                });
        }
        )
    })

    // Create New staff
    app.post('/staff', async (req, res) => {
        const staff = req.body;

        staffsCollection.insertOne(staff, (err, result) => {
            err && res.send({
                status: false,
                message: 'An Error Occurred. Please try again later!',
            })
            result && res.send({
                status: true,
                message: 'Staff Created Successfully!',
                staff
            });
        });
    })

    // Get Single staff by id
    app.get('/staff/:id', async (req, res) => {
        const id = req.params.id;

        try {
            const staff = await staffsCollection.findOne({ _id: ObjectId(id) })
            staff &&
                res.send({
                    status: true,
                    staff
                })
        }
        catch {
            res.send({
                status: false,
                message: "Staff Id doesn't match!"
            })
        }
    })

    // Update staff By Id
    app.patch('/staff/:id', async (req, res) => {
        await staffsCollection.updateOne(
            {
                _id: ObjectId(req.params.id),
            },
            {
                $set: req.body
            },
            (err, result) => {
                err &&
                    res.send({
                        status: false,
                        message: "An Error Occurred while Updating the staff information. Please try again later!"
                    });
                result &&
                    res.send({
                        status: true,
                        message: "Your Staff Information updated successfully!"
                    });
            }
        )
    })

    //   Get all staff
    app.get('/staffs', async (req, res) => {

        try {
            const staffs = await staffsCollection.find({}).toArray();
            staffs.length > 0 ?
                res.send({
                    status: true,
                    staffs,
                    message: 'Staff information fetched successfully'
                })
                :
                res.send({
                    status: false,
                    staffs,
                    message: 'No staffs were found'
                })
        }
        catch {
            res.send({
                status: false,
                message: "An Error occurred. Please try again later!"
            })
        }
    })

    // Delete staff By Id
    app.delete('/staff/:id', async (req, res) => {
        await staffsCollection.deleteOne({ _id: ObjectId(req.params.id) }, (err, result) => {
            err &&
                res.send({
                    status: false,
                    message: "An Error Occurred while Deleting the staff information. Please try again later!"
                });
            result &&
                res.send({
                    status: true,
                    message: "Staff Deleted !"
                });
        }
        )
    })

    // Create New slot
    app.post('/slot', async (req, res) => {
        const slot = req.body;

        slotsCollection.insertOne(slot, (err, result) => {
            err && res.send({
                status: false,
                message: 'An Error Occurred. Please try again later!',
            })
            result && res.send({
                status: true,
                message: 'Slot Created Successfully!',
                slot
            });
        });
    })

    // Update slot By Id
    app.patch('/slot/:id', async (req, res) => {
        await slotsCollection.updateOne(
            {
                _id: ObjectId(req.params.id),
            },
            {
                $set: req.body
            },
            (err, result) => {
                err &&
                    res.send({
                        status: false,
                        message: "An Error Occurred while Updating the slot information. Please try again later!"
                    });
                result &&
                    res.send({
                        status: true,
                        message: "Your Slot Information updated successfully!"
                    });
            }
        )
    })

    //   Get all slot
    app.get('/slots', async (req, res) => {

        try {
            const slots = await slotsCollection.find({}).toArray();
            slots.length > 0 ?
                res.send({
                    status: true,
                    slots,
                    message: 'Slot information fetched successfully'
                })
                :
                res.send({
                    status: false,
                    slots,
                    message: 'No slots were found'
                })
        }
        catch {
            res.send({
                status: false,
                message: "An Error occurred. Please try again later!"
            })
        }
    })

    // Delete slot By Id
    app.delete('/slot/:id', async (req, res) => {
        await slotsCollection.deleteOne({ _id: ObjectId(req.params.id) }, (err, result) => {
            err &&
                res.send({
                    status: false,
                    message: "An Error Occurred while Deleting the slot information. Please try again later!"
                });
            result &&
                res.send({
                    status: true,
                    message: "Slot Deleted !"
                });
        }
        )
    })

    app.post('/order', async (req, res) => {

        const orderDetails = req.body

        const query = {
            date: new Date().toISOString().split('T')[0],
            "service._id": `${req.body.service._id}`,
            "staff._id": `${req.body.staff._id}`,
            "slot._id": `${req.body.slot._id}`
        }

        const payments = await paymentCollection.find(query).toArray();

        payments.length > 0 ?
            res.send({
                status: false,
                message: 'Staff is Busy in this Slot. Please choose another slot or another staff!'
            })
            :
            paymentCollection.insertOne(orderDetails, (err, result) => {
                err && res.send({
                    status: false,
                    message: 'There is an error placing new order. Please try again later!',
                })
                result &&
                    res.send({
                        status: true,
                        message: 'Appointment Booked Successfully!'
                    })
            });
    })

    app.get('/pay/:amount/:trx_id', async (req, res) => {
        const amount = Number(req.params.amount)
        const trx_id = req.params.trx_id

        const data = {
            total_amount: amount,
            currency: 'BDT',
            tran_id: `${trx_id}`,
            success_url: `https://sheba-xyz-backend.onrender.com/success/${trx_id}`,
            fail_url: `https://sheba-xyz-backend.onrender.com/fail/${trx_id}`,
            cancel_url: `https://sheba-xyz-backend.onrender.com/cancel/${trx_id}`,
            ipn_url: 'https://sheba-xyz-backend.onrender.com/ipn',
            shipping_method: 'Courier',
            product_name: 'Computer.',
            product_category: 'Electronic',
            product_profile: 'general',
            cus_name: 'Customer Name',
            cus_email: 'cust@yahoo.com',
            cus_add1: 'Dhaka',
            cus_add2: 'Dhaka',
            cus_city: 'Dhaka',
            cus_state: 'Dhaka',
            cus_postcode: '1000',
            cus_country: 'Bangladesh',
            cus_phone: '01',
            cus_fax: '01',
            ship_name: 'Customer Name',
            ship_add1: 'Dhaka',
            ship_add2: 'Dhaka',
            ship_city: 'Dhaka',
            ship_state: 'Dhaka',
            ship_postcode: 1000,
            ship_country: 'Bangladesh',
        };

        sslcz.init(data)
            .then(async apiResponse => {
                let GatewayPageURL = await apiResponse.GatewayPageURL
                GatewayPageURL &&
                    res.send({
                        status: true,
                        payment_link: GatewayPageURL
                    });
            });
    })

    app.post('/success/:trx_id', async (req, res) => {
        const trx_id = req.params.trx_id

        const paymentDetails = { status: 'success' }

        paymentCollection.updateOne({ trx_id },
            {
                $set: paymentDetails
            },
            (err, result) => {
                err && res.redirect('https://sheba-xyz-backend.onrender.com/fail')
                result && res.redirect(`https://sheba-web.netlify.app/dashboard`)
            })
    })

    app.post('/fail/:trx_id', (req, res) => {
        const trx_id = req.params.trx_id

        const paymentDetails = { status: 'fail' }

        paymentCollection.updateOne({ trx_id },
            {
                $set: paymentDetails
            },
            (err, result) => {
                err && res.redirect('https://sheba-xyz-backend.onrender.com/fail')
                result && res.redirect('https://sheba-web.netlify.app/dashboard')
            }
        )
    })

    app.post('/cancel/:trx_id', (req, res) => {
        const trx_id = req.params.trx_id

        const paymentDetails = { status: 'cancel' }

        paymentCollection.updateOne({ trx_id },
            {
                $set: paymentDetails
            },
            (err, result) => {
                err && res.redirect('https://sheba-xyz-backend.onrender.com/fail')
                result && res.redirect('https://sheba-web.netlify.app/dashboard')
            })
    })

    // Get All payments
    app.get('/payments', async (req, res) => {

        await paymentCollection.find({}).toArray((err, payments) => {
            err && res.send({
                status: false,
                message: "Error. Please try again later!"
            })
            res.send({
                status: true,
                payments
            });
        })
    })

    // Get All payments by email
    app.get('/payments-email/:email', async (req, res) => {

        await paymentCollection.find({ email: req.params.email }).toArray((err, payments) => {
            err && res.send({
                status: false,
                message: "Error. Please try again later!"
            })
            res.send({
                status: true,
                payments
            });
        })
    })

    // Get staff payments by email
    app.get('/staff-payments/:name', async (req, res) => {

        const query = {
            "staff.name": req.params.name
        }

        await paymentCollection.find(query).toArray((err, payments) => {
            err && res.send({
                status: false,
                message: "Error. Please try again later!"
            })
            res.send({
                status: true,
                payments
            });
        })
    })

    // Get All payments
    app.get('/payments/:trx_id', async (req, res) => {
        const trx_id = req.params.trx_id

        await paymentCollection.find({ trx_id }).toArray((err, payments) => {
            err && res.send({
                status: false,
                message: "There is an error getting all payments. Please try again later!"
            })
            payments.length === 0 ?
                res.send({
                    status: false,
                    message: 'No Receipt Found'
                })
                :
                res.send({
                    status: true,
                    payments
                });
        })
    })

    // Post Reviews
    app.post('/review', async (req, res) => {
        const review = req.body

        reviewsCollection.insertOne(review, (err, result) => {
            err && res.send({
                status: false,
                message: 'An Error Occurred. Please try again later!',
            })
            result && res.send({
                status: true,
                message: 'Review Added Successfully!'
            });
        })

        // const query = {
        //     name: req.body.name,
        //     user: req.body.user,
        //     service: req.body.service,
        // }

        // const existingReview = await reviewsCollection.findOne(query);
        // console.log(existingReview);

        // if (existingReview) {
        //     res.send({
        //         status: false,
        //         message: 'You have already given review for this service from this staff!'
        //     })
        // }
        // else {
        //     reviewsCollection.insertOne(review, (err, result) => {
        //         err && res.send({
        //             status: false,
        //             message: 'An Error Occurred. Please try again later!',
        //         })
        //         result && res.send({
        //             status: true,
        //             message: 'Review Added Successfully!'
        //         });
        //     })
        // }
    })

    // Get Reviews by staff name
    app.get('/staff-reviews/:name', async (req, res) => {

        const query = {
            name: req.params.name
        }

        await reviewsCollection.find(query).toArray((err, reviews) => {
            err && res.send({
                status: false,
                message: "Error. Please try again later!"
            })
            res.send({
                status: true,
                reviews
            });
        })
    })

    err ? console.log("Error: " + err) : console.log("MongoDB Connected");
})

app.listen(port, () => {
    console.log(`Backend is Running on port ${port}`);
})