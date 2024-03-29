// Server API makes it possible to hook into various parts of Gridsome
// on server-side and add custom data to the GraphQL data layer.
// Learn more: https://gridsome.org/docs/server-api/

// Changes here require a server restart.
// To restart press CTRL + C in terminal and run `gridsome develop`

const { getWorkshops } = require("./static-generation/workshops/load");

module.exports = function (api) {
    api.loadSource(async action => {

        let workshopsCollection = action.addCollection("Workshops");

        let workshops = await getWorkshops();

        workshops.forEach(workshop => {
            workshopsCollection.addNode({
                id: workshop._id,
                ...workshop
            });
        })

    })
}