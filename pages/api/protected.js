import { authenticate } from '../../utils/auth';

async function handler(req, res) {
    res.status(200).json({ email: req.user.email, id: req.user.userId });
}

export default authenticate(handler);
