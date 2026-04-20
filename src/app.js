import express from 'express';
import adminRoutes from './modules/admin/admin.routes.js';
import authRoutes from './modules/auth/auth.routes.js';
import providersRoutes from './modules/providers/providers.routes.js';
import reviewRoutes from './modules/review/review.routes.js';
import serviceRoutes from './modules/service/service.routes.js';
import serviceRequestRoutes from './modules/service-request/service-request.routes.js';
import usersRoutes from './modules/users/users.routes.js';
import cors from 'cors';



const app = express();

app.use(express.json());
app.use(cors());

app.use('/api/admin', adminRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/providers', providersRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/services', serviceRoutes);
app.use('/api/service-requests', serviceRequestRoutes);
app.use('/api/users', usersRoutes);


app.get('/', (req, res) => {
  res.send('¡Servidor backend funcionando con Android!');
});

export default app;