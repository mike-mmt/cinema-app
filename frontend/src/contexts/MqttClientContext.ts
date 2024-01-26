import { MqttClient } from 'mqtt';
import React, { createContext } from 'react';

export const MqttClientContext = createContext<React.MutableRefObject<MqttClient | undefined> | undefined>(undefined);
