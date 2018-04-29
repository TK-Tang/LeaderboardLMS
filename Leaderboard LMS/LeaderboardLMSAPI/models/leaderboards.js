module.exports = function(sequelize, Sequelize){
    const Leaderboards = sequelize.define("Leaderboards", {
        id: {
            autoIncrement: true,
            primaryKey: true,
            type: Sequelize.INTEGER,
            field: "leaderboard_id"
        },

        name: {
            type: Sequelize.STRING,
            notEmpty: true
        },

        blurb: {
            type: Sequelize.STRING
        }
    }, { underscored: true });

    Leaderboards.getLeaderboard = async function(leaderboard_id){
        return await this.findOne({
            where: { leaderboard_id: leaderboard_id }
        });
    };

    Leaderboards.getLeaderboardIncludingRankings = async function(leaderboard_id, models){
        return await this.findOne({
            where: { leaderboard_id: leaderboard_id },
            include: [
                {
                    model: models.Rankings,
                    include: [
                        {
                            model: models.StudentAnonymitySettings
                        },
                        {
                            model: models.Users,
                            attributes: [ "email", "username", "profilePictureLink"]
                        }
                    ]
                },
                {
                    model: models.RankingSections
                }
            ]
        });
    }

    Leaderboards.insertLeaderboard = async function(course_id, name, blurb){
        const leaderboard = {
            course_id: course_id,
            name: name,
            blurb: blurb
        };

        return await this.create(leaderboard);
    };

    Leaderboards.updateLeaderboard = async function(leaderboard_id, name, blurb){
        leaderboardDetails = {
            name: name,
            blurb: blurb
        }

        const t = await sequelize.transaction();
        const currentLeaderboard = await Leaderboards.findOne({
            where: { leaderboard_id: leaderboard_id }
        }, {transaction: t});

        if (!currentLeaderboard){ return null; }
        const updatedLeaderboard = await currentLeaderboard.updateAttributes(leaderboardDetails, {transaction: t});
        t.commit();

        return updatedLeaderboard;
    }

    // Delete leaderboard

    return Leaderboards;
}