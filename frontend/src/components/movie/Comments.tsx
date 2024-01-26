/* eslint-disable no-mixed-spaces-and-tabs */
import { useEffect, useRef, useState } from 'react';
// import { MqttClientContext } from '../../contexts/MqttClientContext';
import axios from 'axios';
import mqtt from 'mqtt';
import { BiSolidLike, BiSolidDislike, BiLike, BiDislike } from 'react-icons/bi';

type Props = {
	movieId: string;
};

interface Comment {
	id: string;
	author: string;
	body: string;
	likes: number;
	dislikes: number;
	movieId?: string;
}

interface likeUpdate {
	id: string;
	likes?: number;
	dislikes?: number;
}

interface hasLiked {
	id: string;
	liked: boolean;
	disliked: boolean;
}

export default function Comments({ movieId }: Props) {
	const [comments, setComments] = useState<Comment[]>([]);
	const [name, setName] = useState<string>('');
	const [messageInput, setMessageInput] = useState('');
	const [hasLiked, setHasLiked] = useState<hasLiked[]>([]);

	// const mqttClientContext = useContext(MqttClientContext);
	const clientRef = useRef<mqtt.MqttClient>();

	const mqttMessageHandler = (topic: string, message: Buffer) => {
		// message is Buffer
		console.log('1', topic, message.toString());

		switch (topic) {
			case 'omnicinema/comments/' + movieId:
				// setComments([...comments, JSON.parse(message.toString())]);
				setComments((prevComments) =>
					prevComments ? [...prevComments, JSON.parse(message.toString())] : [JSON.parse(message.toString())],
				);
				break;
			case 'omnicinema/comments/likes/' + movieId: {
				console.log('like update', message.toString());

				const update: likeUpdate = JSON.parse(message.toString());
				setComments((prevComments) =>
					prevComments.map((comment) => {
						if (comment.id === update.id) {
							return {
								...comment,
								likes: comment.likes + (update.likes ? update.likes : 0),
								dislikes: comment.dislikes + (update.dislikes ? update.dislikes : 0),
							};
						} else {
							return comment;
						}
					}),
				);
				axios.patch(import.meta.env.VITE_BACKEND_URL + '/comments/' + update.id, update).then((response) => {
					console.log(response.data);
				});

				break;
			}

			default:
				break;
		}
	};

	useEffect(() => {
		// mqttClientContext?.current?.subscribe(['omnicinema/chat']);

		// mqttClientContext?.current?.on('message', mqttMessageHandler);
		const client = mqtt.connect('ws://localhost:8000/mqtt');
		clientRef.current = client;

		client.on('connect', () => {
			console.log('connected');

			client.subscribe(['omnicinema/comments/' + movieId, 'omnicinema/comments/likes/' + movieId], (err) => {
				if (!err) {
					client.publish('presence', 'Hello mqtt');
				}
			});
			client.on('message', mqttMessageHandler);
		});

		axios.get(import.meta.env.VITE_BACKEND_URL + '/account').then((response) => {
			console.log(response.data);

			response.status === 200 && setName(response.data.firstName + ' ' + response.data.lastName);
		});

		axios.get(import.meta.env.VITE_BACKEND_URL + '/comments/' + movieId).then((response) => {
			response.status === 200 && setComments(response.data);
		});

		// mqttClientContext?.current?.subscribe(['omnicinema/comments/' + movieId]);

		// mqttClientContext?.current?.on('message', mqttMessageHandler);
		return () => {
			// mqttClientContext?.current?.unsubscribe(['omnicinema/chat']);
			// mqttClientContext?.current?.removeListener('message', mqttMessageHandler);
			client.removeAllListeners();
			client.end();
		};
		// return () => {
		// 	mqttClientContext?.current?.unsubscribe(['omnicinema/comments/' + movieId]);
		// 	mqttClientContext?.current?.removeListener('message', mqttMessageHandler);
		// };
	}, []);

	const handleClick = () => {
		const message: Comment = {
			author: name,
			body: messageInput,
			id: crypto.randomUUID(),
			likes: 0,
			dislikes: 0,
			movieId: movieId,
		};
		clientRef.current?.publish('omnicinema/comments/' + movieId, JSON.stringify(message));
		axios.post(import.meta.env.VITE_BACKEND_URL + '/comments/' + movieId, message).then((response) => {
			console.log(response.data);
		});
		setMessageInput('');
		return;
	};

	const handleLike = (e: React.MouseEvent<SVGElement, MouseEvent>, id: string) => {
		e.preventDefault();
		console.log('like');

		const update: likeUpdate = {
			id: id,
			likes: 1,
		};
		clientRef.current?.publish('omnicinema/comments/likes/' + movieId, JSON.stringify(update));
		const thisHasLiked = hasLiked.find((comment) => comment.id === id);
		setHasLiked((prevHasLiked) =>
			thisHasLiked
				? prevHasLiked.map((comment) => {
						if (comment.id === id) {
							return { ...comment, liked: true };
						} else {
							return comment;
						}
				  })
				: [{ id: id, liked: true, disliked: false }],
		);
	};

	const handleUnLike = (e: React.MouseEvent<SVGElement, MouseEvent>, id: string) => {
		const update: likeUpdate = {
			id: id,
			likes: -1,
		};
		clientRef.current?.publish('omnicinema/comments/likes/' + movieId, JSON.stringify(update));
		const thisHasLiked = hasLiked.find((comment) => comment.id === id);
		setHasLiked((prevHasLiked) =>
			thisHasLiked
				? prevHasLiked.map((comment) => {
						if (comment.id === id) {
							return { ...comment, liked: false };
						} else {
							return comment;
						}
				  })
				: [{ id: id, liked: false, disliked: false }],
		);
	};

	const handleDislike = (e: React.MouseEvent<SVGElement, MouseEvent>, id: string) => {
		e.preventDefault();

		// if (!hasLiked.find((comment) => comment.id === id)?.disliked) {
		const update: likeUpdate = {
			id: id,
			dislikes: 1,
		};
		clientRef.current?.publish('omnicinema/comments/likes/' + movieId, JSON.stringify(update));
		const thisHasLiked = hasLiked.find((comment) => comment.id === id);
		setHasLiked((prevHasLiked) =>
			thisHasLiked
				? prevHasLiked.map((comment) => {
						if (comment.id === id) {
							return { ...comment, disliked: true };
						} else {
							return comment;
						}
				  })
				: [{ id: id, liked: false, disliked: true }],
		);
	};

	const handleUnDislike = (e: React.MouseEvent<SVGElement, MouseEvent>, id: string) => {
		const update: likeUpdate = {
			id: id,
			dislikes: -1,
		};
		clientRef.current?.publish('omnicinema/comments/likes/' + movieId, JSON.stringify(update));
		const thisHasLiked = hasLiked.find((comment) => comment.id === id);
		setHasLiked((prevHasLiked) =>
			thisHasLiked
				? prevHasLiked.map((comment) => {
						if (comment.id === id) {
							return { ...comment, disliked: false };
						} else {
							return comment;
						}
				  })
				: [{ id: id, liked: false, disliked: false }],
		);
	};

	return (
		<div className='flex flex-col gap-3 items-center w-11/12 mt-6'>
			<div className='flex flex-col gap-2 pb-8 border-b-2 border-magnolia w-11/12'>
				<h1 className='font-semibold text-xl'>Comments</h1>
				<input
					type='text'
					onChange={(e) => setMessageInput(e.target.value)}
					value={messageInput}
					className='text-magnolia bg-transparent border-2 border-outer-space rounded-md p-2 focus:outline-none'
				/>
				<button className='w-fit px-4 ml-12 mt-2 border-b-2 border-magnolia' onClick={handleClick}>
					Wyślij
				</button>
			</div>
			<div className='flex flex-col gap-2 w-11/12'>
				{comments &&
					comments.map((comment, index) => (
						<div key={index} className='flex flex-col gap-1'>
							<div className='flex flex-row gap-4'>
								<p className='font-semibold'>{comment.author}</p>
								<div className='flex gap-2'>
									{(hasLiked.find((x) => x.id === comment.id && x.liked) && (
										<BiSolidLike
											onClick={(e) => handleUnLike(e, comment.id)}
											className='text-green-400'
										/>
									)) || (
										<BiLike onClick={(e) => handleLike(e, comment.id)} className='text-green-400' />
									)}
									<p className='text-green-400'>{comment.likes}</p>
									{(hasLiked.find((x) => x.id === comment.id && x.disliked) && (
										<BiSolidDislike
											onClick={(e) => handleUnDislike(e, comment.id)}
											className='text-red-400'
										/>
									)) || (
										<BiDislike
											onClick={(e) => handleDislike(e, comment.id)}
											className='text-red-400'
										/>
									)}
									<p className='text-red-400'>{comment.dislikes}</p>
								</div>
							</div>
							<p className='p-2 border-2 rounded-md border-outer-space'>{comment.body}</p>
						</div>
					))}
			</div>
		</div>
	);
}
