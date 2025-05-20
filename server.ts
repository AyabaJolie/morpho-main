import express, { Request, Response } from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import mongoose, { Document, Schema } from 'mongoose';
import nodemailer from 'nodemailer';

interface IUser extends Document {
  email: string;
  password: string;
  measurements?: {
    bust: number;
    waist: number;
    hips: number;
  };
}

interface AuthRequest extends Request {
  body: {
    email: string;
    password: string;
  };
}

interface AnalyzeRequest extends Request {
  body: {
    bust: number;
    waist: number;
    hips: number;
  };
}

interface AnalysisResult {
  type: string;
  advice: string;
}

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Connexion MongoDB
mongoose.connect('mongodb://localhost:27017/morpho');

// Schéma utilisateur typé
const userSchema = new Schema<IUser>({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  measurements: {
    bust: Number,
    waist: Number,
    hips: Number
  }
});

const User = mongoose.model<IUser>('User', userSchema);

// Auth routes
app.post('/register', async (req: AuthRequest, res: Response) => {
  try {
    const hashedPassword = bcrypt.hashSync(req.body.password, 8);
    const user = new User({ email: req.body.email, password: hashedPassword });
    await user.save();
    res.status(201).send({ success: true });
  } catch (error) {
    res.status(500).send({ error: 'Registration failed' });
  }
});

app.post('/login', async (req: AuthRequest, res: Response) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) return res.status(404).send('User not found');
    
    const valid = bcrypt.compareSync(req.body.password, user.password);
    if (!valid) return res.status(401).send('Invalid password');
    
    const token = jwt.sign({ id: user._id }, 'SECRET_KEY', { expiresIn: '24h' });
    res.send({ token });
  } catch (error) {
    res.status(500).send({ error: 'Login failed' });
  }
});

// Morpho analysis
app.post('/analyze', async (req: AnalyzeRequest, res: Response) => {
  try {
    const { bust, waist, hips } = req.body;
    
    let type: string = 'X';
    if (waist > bust && waist > hips) type = 'O';
    else if (bust > hips + 2) type = 'V';
    else if (hips > bust + 2) type = 'A';
    
    res.send({ type, advice: `Conseils pour type ${type}` });
  } catch (error) {
    res.status(500).send({ error: 'Analysis failed' });
  }
});

interface EmailRequest extends Request {
  body: {
    email: string;
    result: AnalysisResult;
  };
}

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'pekpelignimdoukevin@gmail.com',
    pass: 'Pgk3dollar'
  }
});

app.post('/send-result', async (req: EmailRequest, res: Response) => {
  try {
    const { email, result } = req.body;
    
    await transporter.sendMail({
      from: 'pekpelignimdoukevin@gmail.com',
      to: email,
      subject: 'Votre résultat MorphoConseil',
      text: `Votre type morphologique: ${result.type}\n\nConseils: ${result.advice}`
    });
    
    res.send({ sent: true });
  } catch (error) {
    res.status(500).send({ error: 'Email sending failed' });
  }
});

app.listen(3001, () => console.log('Server running on port 3001'));