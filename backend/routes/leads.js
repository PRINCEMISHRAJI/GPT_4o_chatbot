import express from 'express'
import db from '../config/db.js'

const router = express.Router();

router.post('/capture', (req, res)=> {
    const {name, email, phone, service_type} = req.body;
    
    if (!name || !email || !phone || !service_type) {
        return res.status(400).json({ error: 'All fields are required.' });
    }
    
    // Optionally, validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        return res.status(400).json({ error: 'Invalid email format.' });
    }
    
    db.run("INSERT INTO leads(name, email, phone, service_type) VALUES(?, ?, ?, ?)",
        [name, email, phone, service_type], function(err) {
            if(err){
                return res.status(500).json({ error: 'Internal server error' });
            }
            res.json({ message : "Lead captured  successfully" })

        });
});


router.get('/leads', (req, res)=> {
    db.all("SELECT * FROM leads", [], (err, rows) => {
        if (err) {
          throw err;
        }
        res.json({ leads: rows });
      });
    });

export default router