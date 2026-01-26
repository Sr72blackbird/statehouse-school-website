"use strict";

module.exports = {
  routes: [
    {
      method: "GET",
      path: "/downloads",
      handler: "download.find",
      config: {
        policies: [],
      },
    },
    {
      method: "GET",
      path: "/downloads/:id",
      handler: "download.findOne",
      config: {
        policies: [],
      },
    },
    {
      method: "POST",
      path: "/downloads",
      handler: "download.create",
      config: {
        policies: [],
      },
    },
    {
      method: "PUT",
      path: "/downloads/:id",
      handler: "download.update",
      config: {
        policies: [],
      },
    },
    {
      method: "DELETE",
      path: "/downloads/:id",
      handler: "download.delete",
      config: {
        policies: [],
      },
    },
  ],
};
