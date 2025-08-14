package com.example.CBB_Insight.player;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

//for bigger datasets with multiple conferences add conference string
@Entity
@Table(name="player_data")
public class Player {

    @Id
    @Column(name= "player_name", unique = true)
    private String playerName;

    private String position;

    private Integer games_played;

    private Integer games_started;

    private Float minutes_played;

    private Float fg_per_game;

    private Float fga_per_game;

    private Float fg_percentage;

    private Float threep_per_game;

    private Float threepa_per_game;

    private Float threep_percentage;

    private Float twop_per_game;

    private Float twopa_per_game;

    private Float twop_percentage;

    private Float efg;

    private Float ft_per_game;

    private Float fta_per_game;

    private Float ft_percentage;

    private Float orb;

    private Float drb;

    private Float trb;

    private Float ast;

    private Float stl;

    private Float blk;

    private Float tov;

    private Float pf;

    private Float pts;

    private String school_name;

    private String conference;

    public Player() {
    }

    public Player(String playerName, String position, Integer games_played, Integer games_started, Float minutes_played, Float fg_per_game, Float fga_per_game, Float fg_percentage, Float threep_per_game, Float threepa_per_game, Float threep_percentage, Float twop_per_game, Float twopa_per_game, Float twop_percentage, Float efg, Float ft_per_game, Float fta_per_game, Float ft_percentage, Float orb, Float drb, Float trb, Float ast, Float stl, Float blk, Float tov, Float pf, Float pts, String school_name) {
        this.playerName = playerName;
        this.position = position;
        this.games_played = games_played;
        this.games_started = games_started;
        this.minutes_played = minutes_played;
        this.fg_per_game = fg_per_game;
        this.fga_per_game = fga_per_game;
        this.fg_percentage = fg_percentage;
        this.threep_per_game = threep_per_game;
        this.threepa_per_game = threepa_per_game;
        this.threep_percentage = threep_percentage;
        this.twop_per_game = twop_per_game;
        this.twopa_per_game = twopa_per_game;
        this.twop_percentage = twop_percentage;
        this.efg = efg;
        this.ft_per_game = ft_per_game;
        this.fta_per_game = fta_per_game;
        this.ft_percentage = ft_percentage;
        this.orb = orb;
        this.drb = drb;
        this.trb = trb;
        this.ast = ast;
        this.stl = stl;
        this.blk = blk;
        this.tov = tov;
        this.pf = pf;
        this.pts = pts;
        this.school_name = school_name;
        this.conference = conference;
    }

    public Player(String playerName) {
        this.playerName = playerName;
    }

    public String getPlayerName() {
        return playerName;
    }

    public void setPlayerName(String playerName) {
        this.playerName = playerName;
    }

    public String getPosition() {
        return position;
    }

    public void setPosition(String position) {
        this.position = position;
    }

    public Integer getGames_played() {
        return games_played;
    }

    public void setGames_played(Integer games_played) {
        this.games_played = games_played;
    }

    public Integer getGames_started() {
        return games_started;
    }

    public void setGames_started(Integer games_started) {
        this.games_started = games_started;
    }

    public Float getMinutes_played() {
        return minutes_played;
    }

    public void setMinutes_played(Float minutes_played) {
        this.minutes_played = minutes_played;
    }

    public Float getFg_per_game() {
        return fg_per_game;
    }

    public void setFg_per_game(Float fg_per_game) {
        this.fg_per_game = fg_per_game;
    }

    public Float getFga_per_game() {
        return fga_per_game;
    }

    public void setFga_per_game(Float fga_per_game) {
        this.fga_per_game = fga_per_game;
    }

    public Float getFg_percentage() {
        return fg_percentage;
    }

    public void setFg_percentage(Float fg_percentage) {
        this.fg_percentage = fg_percentage;
    }

    public Float getThreep_per_game() {
        return threep_per_game;
    }

    public void setThreep_per_game(Float threep_per_game) {
        this.threep_per_game = threep_per_game;
    }

    public Float getThreepa_per_game() {
        return threepa_per_game;
    }

    public void setThreepa_per_game(Float threepa_per_game) {
        this.threepa_per_game = threepa_per_game;
    }

    public Float getThreep_percentage() {
        return threep_percentage;
    }

    public void setThreep_percentage(Float threep_percentage) {
        this.threep_percentage = threep_percentage;
    }

    public Float getTwop_per_game() {
        return twop_per_game;
    }

    public void setTwop_per_game(Float twop_per_game) {
        this.twop_per_game = twop_per_game;
    }

    public Float getTwopa_per_game() {
        return twopa_per_game;
    }

    public void setTwopa_per_game(Float twopa_per_game) {
        this.twopa_per_game = twopa_per_game;
    }

    public Float getTwop_percentage() {
        return twop_percentage;
    }

    public void setTwop_percentage(Float twop_percentage) {
        this.twop_percentage = twop_percentage;
    }

    public Float getEfg() {
        return efg;
    }

    public void set(Float efg) {
        this.efg = efg;
    }

    public Float getFt_per_game() {
        return ft_per_game;
    }

    public void setFt_per_game(Float ft_per_game) {
        this.ft_per_game = ft_per_game;
    }

    public Float getFta_per_game() {
        return fta_per_game;
    }

    public void setFta_per_game(Float fta_per_game) {
        this.fta_per_game = fta_per_game;
    }

    public Float getFt_percentage() {
        return ft_percentage;
    }

    public void setFt_percentage(Float ft_percentage) {
        this.ft_percentage = ft_percentage;
    }

    public Float getOrb() {
        return orb;
    }

    public void setOrb(Float orb) {
        this.orb = orb;
    }

    public Float getDrb() {
        return drb;
    }

    public void setDrb(Float drb) {
        this.drb = drb;
    }

    public Float getTrb() {
        return trb;
    }

    public void setTrb(Float trb) {
        this.trb = trb;
    }

    public Float getAst() {
        return ast;
    }

    public void setAst(Float ast) {
        this.ast = ast;
    }

    public Float getStl() {
        return stl;
    }

    public void setStl(Float stl) {
        this.stl = stl;
    }

    public Float getBlk() {
        return blk;
    }

    public void setBlk(Float blk) {
        this.blk = blk;
    }

    public Float getTov() {
        return tov;
    }

    public void setTov(Float tov) {
        this.tov = tov;
    }

    public Float getPf() {
        return pf;
    }

    public void setPf(Float pf) {
        this.pf = pf;
    }

    public Float getPts() {
        return pts;
    }

    public void setPts(Float pts) {
        this.pts = pts;
    }

    public String getSchool_name() {
        return school_name;
    }

    public void setSchool_name(String school_name) {
        this.school_name = school_name;
    }

    public String getConference() {
        return conference;
    }

    public void setConference(String conference) {
        this.conference = conference;
    }
}
