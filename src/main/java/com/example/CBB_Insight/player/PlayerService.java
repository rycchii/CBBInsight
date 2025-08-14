package com.example.CBB_Insight.player;

import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Component
public class PlayerService {

    private final PlayerRepository playerRepository;

    @Autowired
    public PlayerService(PlayerRepository playerRepository) {
        this.playerRepository = playerRepository;
    }

    public List<Player> getPlayers() {
        return playerRepository.findAll();
    }

    public List<Player> getPlayersFromSchool(String school_name) {
        return playerRepository.findAll().stream().filter(player -> school_name.equals(player.getSchool_name()))
                .collect(Collectors.toList());
    }

    public List<Player> getPlayersByName(String searchText) {
        return playerRepository.findAll().stream()
                .filter(player -> player.getPlayerName().toLowerCase().contains(searchText.toLowerCase())).collect(Collectors.toList());
    }

    public List<Player> getPlayersByPosition(String searchText) {
        return playerRepository.findAll().stream()
                .filter(player ->
                        player.getPosition().toLowerCase().contains(searchText.toLowerCase())).collect(Collectors.toList());
    }

    public List<Player> getPlayerByConference(String searchText) {
        return playerRepository.findAll().stream()
                .filter(player -> player.getConference().toLowerCase().contains(searchText.toLowerCase())).collect(Collectors.toList());
    }
    public List<Player> getPlayersBySchoolAndPosition(String school_name, String position) {
        return playerRepository.findAll().stream()
                .filter(player -> school_name.equals(player.getSchool_name()) && position.equals(player.getPosition())).collect(Collectors.toList());
    }

    //add get player by conference


    public Player addPlayer (Player player) {
        playerRepository.save(player);
        return player;
    }

    public Player updatePlayer (Player updatedPlayer) {
        Optional<Player> existingPlayer = playerRepository.findByPlayerName(updatedPlayer.getPlayerName());

        if (existingPlayer.isPresent()) {
            Player playerToUpdate = existingPlayer.get();
            playerToUpdate.setPlayerName(updatedPlayer.getPlayerName());
            playerToUpdate.setPosition(updatedPlayer.getPosition());
            playerToUpdate.setSchool_name(updatedPlayer.getSchool_name());

            playerRepository.save(playerToUpdate);
            return playerToUpdate;
        }
        return null;
    }

    @Transactional
    public void deletePlayer (String playerName) {
        playerRepository.deleteById(playerName);
    }
}
