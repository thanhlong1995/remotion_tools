import type React from 'react';
import {Outro} from '../../shared/Outro';
import {LineOverlay} from '../kit';
import {scene} from '../timeline';

// Up on the tin roof, Mướp watches the chaos below; iris out, then Vàng's sign-off
export const RoofScene: React.FC = () => <Outro scene={scene('roof')} overlay={LineOverlay} />;
