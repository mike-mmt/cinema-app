import { useEffect, useRef, useState } from 'react';
import GrayContentWrapper from './GrayContentWrapper';

import mqtt from 'mqtt';
import axios from 'axios';

interface mqttMessage {
	author: string;
	message: string;
}

export default function Chat() {
	const [messageInput, setMessageInput] = useState('');
	const [messages, setMessages] = useState<mqttMessage[]>([]);
	const [name, setName] = useState<string>('');
	const clientRef = useRef<mqtt.MqttClient>();
	const messagesEndRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		const client = mqtt.connect('ws://localhost:8000/mqtt');
		clientRef.current = client;

		client.on('connect', () => {
			console.log('connected');

			client.subscribe(['omnicinema/chat'], (err) => {
				if (!err) {
					client.publish('presence', 'Hello mqtt');
				}
			});
		});

		client.on('message', (topic, message) => {
			// message is Buffer
			switch (topic) {
				case 'omnicinema/chat':
					setMessages((prevMessages) => [...prevMessages, JSON.parse(message.toString())]);

					break;

				default:
					break;
			}
		});

		axios.get(import.meta.env.VITE_BACKEND_URL + '/account').then((response) => {
			console.log(response.data);

			response.status === 200 && setName(response.data.firstName + ' ' + response.data.lastName);
		});

		// Clean up the connection when the component unmounts
		return () => {
			client.end();
		};
	}, []);

	function handleClick() {
		// const pub = client?.publish('omnicinema/allchat', messageInput);
		const jsonMessage = JSON.stringify({
			author: name,
			message: messageInput,
		});
		clientRef.current?.publish('omnicinema/chat', jsonMessage);
		setMessageInput('');
		return;
	}
	useEffect(() => {
		messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
	}, [messages]);

	return (
		<GrayContentWrapper>
			<div className='flex flex-col gap-4'>
				<div className='h-48 m-6 flex flex-col overflow-y-scroll *:border-b *:border-gray-600'>
					{messages.map((message, index) => (
						<span key={index} className='flex gap-2'>
							<p className='text-gray-400'>{message.author}:</p>
							<p>{message.message}</p>
						</span>
					))}
					<div className='border-none' ref={messagesEndRef} />
				</div>
				<div className='flex gap-4 ml-10'>
					<input
						className='text-magnolia py-1 px-2 bg-outer-space focus:outline-none focus:border focus:border-magnolia'
						type='text'
						value={messageInput}
						onChange={(e) => setMessageInput(e.currentTarget.value)}
						onKeyDown={(event) => {
							if (event.key === 'Enter') {
								handleClick();
							}
						}}
					></input>
					<button onClick={handleClick}>Wyślij</button>
				</div>
			</div>
		</GrayContentWrapper>
	);
}
