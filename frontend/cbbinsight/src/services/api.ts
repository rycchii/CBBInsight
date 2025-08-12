const API_BASE_URL = 'http://localhost:8080/api/v1';

export interface Player {
  id: number;
  player: string;
  position: string;
  gamesPlayed: number;
  gamesStarted: number;
  minutesPlayed: number;
  fieldGoals: number;
  fieldGoalAttempts: number;
  fieldGoalPercentage: number;
  threePointers: number;
  threePointerAttempts: number;
  threePointerPercentage: number;
  freeThrows: number;
  freeThrowAttempts: number;
  freeThrowPercentage: number;
  offensiveRebounds: number;
  defensiveRebounds: number;
  totalRebounds: number;
  assists: number;
  steals: number;
  blocks: number;
  turnovers: number;
  personalFouls: number;
  points: number;
  school: string;
  conference: string;
}

export interface Conference {
  name: string;
  playerCount?: number;
  schoolCount?: number;
}

class ApiService {
  private async request<T>(endpoint: string, options?: RequestInit): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;
    
    try {
      const response = await fetch(url, {
        headers: {
          'Content-Type': 'application/json',
          ...options?.headers,
        },
        ...options,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error(`API request failed for ${endpoint}:`, error);
      throw error;
    }
  }

  async getAllPlayers(): Promise<Player[]> {
    return this.request<Player[]>('/player');
  }

  async getPlayersByConference(conference: string): Promise<Player[]> {
    return this.request<Player[]>(`/player/conference/${encodeURIComponent(conference)}`);
  }

  async getPlayersBySchool(school: string): Promise<Player[]> {
    return this.request<Player[]>(`/player/school/${encodeURIComponent(school)}`);
  }

  async getConferences(): Promise<Conference[]> {
    try {
      const players = await this.getAllPlayers();
      const conferenceMap = new Map<string, Conference>();

      players.forEach(player => {
        if (player.conference) {
          const existing = conferenceMap.get(player.conference);
          if (existing) {
            existing.playerCount = (existing.playerCount || 0) + 1;
          } else {
            conferenceMap.set(player.conference, {
              name: player.conference,
              playerCount: 1,
            });
          }
        }
      });

      return Array.from(conferenceMap.values()).sort((a, b) => a.name.localeCompare(b.name));
    } catch (error) {
      console.error('Error getting conferences:', error);
      throw error;
    }
  }
}

export const apiService = new ApiService();