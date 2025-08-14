const API_BASE_URL = 'http://localhost:8080/api/v1';

export interface Player {
  playerName: string;
  position: string;
  games_played: number;
  games_started: number;
  minutes_played: number;
  fg_per_game: number;
  fga_per_game: number;
  fg_percentage: number;
  threep_per_game: number;
  threepa_per_game: number;
  threep_percentage: number;
  twop_per_game: number;
  twopa_per_game: number;
  twop_percentage: number;
  efg_percentage: number | null;
  ft_per_game: number;
  fta_per_game: number;
  ft_percentage: number;
  orb: number;
  drb: number;
  trb: number;
  ast: number;
  stl: number;
  blk: number;
  tov: number;
  pf: number;
  pts: number;
  school_name: string;
  conference: string;
}

// Add a computed property for backward compatibility
export interface PlayerWithComputed extends Player {
  school: string; // This will be school_name for compatibility
  player: string; // This will be playerName for compatibility
  id: number; // Add id for key purposes
}

export interface Conference {
  name: string;
  playerCount?: number;
  schoolCount?: number;
}

export interface School {
  id: number;
  name: string;
  mascot?: string;
  location?: string;
  wins?: number;
  losses?: number;
  conference?: string;
  playerCount?: number;
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

  async getAllPlayers(): Promise<PlayerWithComputed[]> {
    const players = await this.request<Player[]>('/player');
    // Map field names for backward compatibility
    return players.map((player, index) => ({
      ...player,
      school: player.school_name, // Add computed property
      player: player.playerName,  // Add computed property for player name
      id: index + 1 // Add id for React keys
    }));
  }

  async getPlayersByConference(conference: string): Promise<PlayerWithComputed[]> {
    const players = await this.request<Player[]>(`/player/conference/${encodeURIComponent(conference)}`);
    return players.map((player, index) => ({
      ...player,
      school: player.school_name,
      player: player.playerName,
      id: index + 1
    }));
  }

  async getPlayersBySchool(school: string): Promise<PlayerWithComputed[]> {
    const players = await this.request<Player[]>(`/player/school/${encodeURIComponent(school)}`);
    return players.map((player, index) => ({
      ...player,
      school: player.school_name,
      player: player.playerName,
      id: index + 1
    }));
  }

  async getAllSchools(): Promise<School[]> {
    try {
      const players = await this.getAllPlayers();
      console.log('Players data for schools:', players.slice(0, 3)) // Debug log
      
      const schoolMap = new Map<string, School>();

      players.forEach((player) => {
        if (player.school_name) {
          const existing = schoolMap.get(player.school_name);
          if (existing) {
            existing.playerCount = (existing.playerCount || 0) + 1;
          } else {
            schoolMap.set(player.school_name, {
              id: schoolMap.size + 1,
              name: player.school_name,
              conference: player.conference,
              playerCount: 1,
              mascot: undefined,
              location: undefined,
              wins: undefined,
              losses: undefined,
            });
          }
        }
      });

      const schools = Array.from(schoolMap.values()).sort((a, b) => a.name.localeCompare(b.name));
      console.log(`Generated ${schools.length} schools from ${players.length} players`) // Debug log
      console.log('Sample schools:', schools.slice(0, 3)) // Debug log
      
      return schools;
    } catch (error) {
      console.error('Error getting schools:', error);
      throw error;
    }
  }

  async getConferences(): Promise<Conference[]> {
    try {
      const players = await this.getAllPlayers()
      console.log('Players data for conferences:', players.slice(0, 3)) // Debug log
    
      const conferenceMap = new Map<string, Conference>()

      players.forEach(player => {
        if (player.conference) {
          const existing = conferenceMap.get(player.conference)
          if (existing) {
            existing.playerCount = (existing.playerCount || 0) + 1
          } else {
            conferenceMap.set(player.conference, {
              name: player.conference,
              playerCount: 1,
              schoolCount: 0
            })
          }
        }
      })

      // Calculate school count more accurately
      const schoolsByConference = new Map<string, Set<string>>()
      players.forEach(player => {
        if (player.conference && player.school_name) {
          if (!schoolsByConference.has(player.conference)) {
            schoolsByConference.set(player.conference, new Set())
          }
          schoolsByConference.get(player.conference)?.add(player.school_name)
        }
      })

      // Update conference data with accurate school counts
      conferenceMap.forEach((conference, name) => {
        const schools = schoolsByConference.get(name)
        conference.schoolCount = schools ? schools.size : 0
        console.log(`Conference ${name}: ${conference.schoolCount} schools, ${conference.playerCount} players`) // Debug log
      })

      return Array.from(conferenceMap.values()).sort((a, b) => a.name.localeCompare(b.name))
    } catch (error) {
      console.error('Error getting conferences:', error)
      throw error
    }
  }

  // Alias methods for backward compatibility
  async getSchools(): Promise<School[]> {
    return this.getAllSchools();
  }

  async getPlayers(): Promise<PlayerWithComputed[]> {
    return this.getAllPlayers();
  }

  async getSchoolsByConference(conference: string): Promise<School[]> {
    try {
      const allSchools = await this.getAllSchools();
      return allSchools.filter(school => 
        school.conference?.toLowerCase() === conference.toLowerCase()
      );
    } catch (error) {
      console.error('Error getting schools by conference:', error);
      throw error;
    }
  }
}

export const apiService = new ApiService();