import { Outlet } from 'react-router';
import AnimatedBackground from './AnimatedBackground';

export default function Root() {
  return (
    <div className="min-h-screen relative overflow-hidden">
      <AnimatedBackground />
      <div className="relative z-10">
        <Outlet />
      </div>
    </div>
  );
}
