import BaseService from "./Base.service";
import fetch from 'node-fetch';
import { Response } from 'node-fetch';
import Repository from '../models/repository.model'
import { config } from 'dotenv';

config();
const TOKEN = process.env.GITHUB_ACCESS_TOKEN;

class RepositoryService extends BaseService {
    constructor() {
        super('GITHUB_API_URL');
        this.addHeader('Authorization', `token ${TOKEN}`);
    }

    public async getAllRepositories() {
        const response: Response = await fetch(`${this.url}/repos`, { headers: this.headers });
        const repositories: Array<Repository> = (await response.json()).map((repo: any) => new Repository(repo));

        return repositories;
    }

    public async getPublicRepositories() {
        const paramsString: string = "visibility=public&affiliation=owner&sort=full_name";
        const searchParams: URLSearchParams = new URLSearchParams(paramsString);

        const response: Response = await fetch(`${this.url}/repos?${searchParams}`, { headers: this.headers });
        const repositories: Array<Repository> = (await response.json()).map((repo: any) => new Repository(repo));

        return repositories;
    }

    public async getPrivateRepositories() {
        const paramsString: string = "visibility=private&affiliation=owner&sort=full_name";
        const searchParams: URLSearchParams = new URLSearchParams(paramsString);

        const response: Response = await fetch(`${this.url}/repos?${searchParams}`, { headers: this.headers });
        const repositories: Array<Repository> = (await response.json()).map((repo: any) => new Repository(repo));

        return repositories;
    }

    public async getTrendingRepositories() { // Simple as I have no popular repos :(
        const paramsString: string = "visibility=public&affiliation=owner&sort=full_name";
        const searchParams: URLSearchParams = new URLSearchParams(paramsString);

        const response: Response = await fetch(`${this.url}/repos?${searchParams}`, { headers: this.headers });
        const repositories: Array<Repository> = (await response.json()).map((repo: any) => new Repository(repo));

        return repositories.filter(r => r.stars > 0 || r.forks > 0 || r.watchers > 0);
    }
}

export default RepositoryService;