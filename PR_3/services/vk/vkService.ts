import axios from 'axios';
import { VK_HOST } from './constants';
import { GetUserResponseDto } from './dto/getUserResponseDto';
import { injectable } from 'tsyringe';
import { GetMessageUploadServerResponseDto } from './dto/getMessageUploadServerResponseDto';
import FormData from 'form-data';
//@ts-ignore
import fetch from 'node-fetch';
import { SaveFileResponseDto } from './dto/saveFileResponseDto';
import { UploadFileResponse } from './dto/uploadFileResponse';

@injectable()
export class VkService {
	private accessToken = process.env.VK_ACCESS_TOKEN;
	private communityToken = process.env.VK_COMMUNITY_TOKEN;

	private axiosInstance = axios.create({
		baseURL: `${VK_HOST}/method/`,
		params: {
			v: '5.131',
			access_token: this.accessToken,
		},
	});

	answerEvent(data: any) {
		return this.axiosInstance.post('messages.sendMessageEventAnswer', data, {
			params: {
				access_token: this.communityToken,
				...data,
			},
		});
	}

	updateMessage(update: Partial<VkBotMessage & { message: string }>) {
		return this.axiosInstance.post('messages.edit', update, {
			params: {
				access_token: this.communityToken,
				...update,
			},
		});
	}

	async getUserById(id: number) {
		try {
			const res = await this.axiosInstance.get<GetUserResponseDto>(
				'users.get',
				{
					params: {
						user_ids: id,
					},
				},
			);

			return res.data.response[0];
		} catch (e) {
			console.log(
				'Ошибка при получении пользователя',
				e instanceof Error ? e.message : e,
			);

			return null;
		}
	}

	async makeAttachmentFromUrl(fileUrl: string, peerId: number) {
		const uploadUrl = await this.getMessagesUploadServer(peerId);

		const uploadResult = await this.uploadFileToMessage(fileUrl, uploadUrl);

		if (uploadResult) {
			const doc = await this.saveFile(uploadResult.file);

			return `doc${doc?.owner_id}_${doc?.id}`;
		}

		return '';
	}

	private async uploadFileToMessage(fileUlr: string, uploadUrl: string) {
		const response = await axios.get(fileUlr, {
			responseType: 'stream',
		});

		response.data.path = 'file.gif';

		const fd = new FormData();
		fd.append('file', response.data);

		if (uploadUrl) {
			const res = await fetch<UploadFileResponse>(uploadUrl, {
				method: 'POST',
				body: fd,
			});

			return res.json();
		}
	}

	private async getMessagesUploadServer(peer_id: number) {
		const res = await this.axiosInstance.get<GetMessageUploadServerResponseDto>(
			'docs.getMessagesUploadServer',
			{
				params: {
					type: 'doc',
					peer_id,
					access_token: this.communityToken,
				},
			},
		);

		return res.data?.response?.upload_url;
	}

	private async saveFile(file: string) {
		const res = await this.axiosInstance.get<SaveFileResponseDto>('docs.save', {
			params: {
				access_token: this.communityToken,
				file,
			},
		});

		return res.data?.response?.doc;
	}
}
