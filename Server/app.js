const express = require("express");
const app = express();
const port = 4000;
const cors = require("cors");
const { response } = require("express");
const corsOptions = {
  origin: "*",
  credentials: true,
  optionSuccessStatus: 200,
};
app.use(cors(corsOptions));
app.use(express.json());

const operations = [1, 2, 3, 4, 5];

const config = [1];

const resources = [
  {
    resourceId: "1",
    resourceName: "Furnace1",
  },
  {
    resourceId: "2",
    resourceName: "Furnace2",
  },
  {
    resourceId: "3",
    resourceName: "Furnace3",
  },
  {
    resourceId: "4",
    resourceName: "Furnace4",
  },
  {
    resourceId: "5",
    resourceName: "Furnace5",
  },
];
const events = [
  {
    id: "1",
    resourceId: "1",
    title: "event 1",
    start: "2022-01-02",
    end: "2022-01-03",
    allDay: false,
    editable: true,
    isEdit: false,
    resourceEditable: false,
    description: "event 1 description",
    operations: [1, 2, 3, 4, 5],
    calendarId: "c1",
    isMaintenance:false,
    autoSchedule:false
  },
  {
    id: "2",
    resourceId: "2",
    title: "event 2",
    start: "2022-01-02",
    end: "2022-01-03",
    allDay: false,
    editable: true,
    isEdit: false,
    resourceEditable: false,
    description: "event 2 description",
    operations: [2, 5],
    calendarId: "c2",
    isMaintenance:false,
    autoSchedule:false
  },
  {
    id: "3",
    resourceId: "3",
    title: "event 3",
    start: "2022-01-02",
    end: "2022-01-03",
    allDay: false,
    editable: true,
    isEdit: false,
    resourceEditable: false,
    description: "event 3 description",
    operations: [1, 3, 4],
    calendarId: "c3",
    isMaintenance:false,
    autoSchedule:false
  },
  {
    id: "4",
    resourceId: "4",
    title: "Maintenance",
    start: "2022-01-02",
    end: "2022-01-03",
    allDay: false,
    editable: true,
    isEdit: false,
    resourceEditable: false,
    description: "event 3 description",
    operations: [1, 3],
    calendarId: "c4",
    isMaintenance:true,
    autoSchedule:false
  }
];

app.get("/e", (req, res) => {
  res.send(events);
});

app.get("/c", (req, res) => {
  res.send(config);
});

app.get("/r", (req, res) => {
  res.send(resources);
});

app.get("/o", (req, res) => {
  res.send(operations);
});

app.post("/create", (req, res) => {
  const newEvent = {
    id: Math.floor(Math.random()*10000).toString(),
    resourceId: req.body.resourceId,
    title: req.body.title,
    start: req.body.start,
    end: req.body.end,
    allDay: false,
    editable: true,
    isEdit: false,
    description: req.body.description,
    operations: req.body.operations,
    calendarId:req.body.calendarId,
    isMaintenance:req.body.isMaintenance,
    autoSchedule:req.body.autoSchedule,
  };
  // console.log(newEvent);
  res.send(newEvent.id)
  events.push(newEvent);
});

app.put("/edit", (req, res) => {
  let edited = req.body;

  events.map((e) => {
    if (e.id === edited.id) {
      e.title = edited.title;
      e.start = edited.start;
      e.end = edited.end;
      e.operations = edited.operations;
      e.description = edited.description;
      e.calendarId = edited.calendarId;
      e.isMaintenance = edited.isMaintenance;
      e.autoSchedule = edited.autoSchedule;
      return;
    }
  });
  res.send(response)
});

app.listen(port, () => {
  console.log(` now listening at http://localhost:${port}`);
});
