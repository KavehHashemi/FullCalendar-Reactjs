/* eslint-disable array-callback-return */
import React from "react";
import FullCalendar from "@fullcalendar/react";
import resourceTimelinePlugin from "@fullcalendar/resource-timeline";
import interactionPlugin from "@fullcalendar/interaction";
import { useState, useRef, useEffect } from "react";
import * as data from "./Data/data.json";
import { Modal, Button } from "react-bootstrap";
import Form from "react-bootstrap/Form";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import uuid from "react-uuid";
import moment from "moment-jalaali";
import "moment/locale/fa";
import TextField from "@mui/material/TextField";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import AdapterJalali from "@date-io/jalaali";
import Multiselect from "multiselect-react-dropdown";
const axios = require("axios");

const ResourceView = () => {
  const calendarRef = useRef(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [dateModalOpen, setDateModalOpen] = useState(false);
  const format = "jYYYY/jM/jD HH:mm";
  const defaultState = {
    id: "",
    resourceId: 0,
    title: "",
    start: new Date(),
    end: new Date(),
    allDay: false,
    editable: true,
    isEdit: false,
    resourceEditable: false,
    description: "",
    operations: [],
    calendarId: "",
    isMaintenance: false,
    autoSchedule: true,
  };
  const [event, setEvent] = useState(defaultState);
  const [eventDuration, setEventDuration] = useState({
    h: 0,
    m: 0,
  });
  const [defaultGap, setDefaultGap] = useState();

  const fetchConfig = () => {
    axios.get("http://localhost:4000/c").then((response) => {
      setDefaultGap(response.data[0]);
    });
  };
  console.log(defaultGap);
  let resourceName;

  const plugins = [resourceTimelinePlugin, interactionPlugin];
  const setColor = (event) => {
    if (event.isMaintenance) {
      event.color = "#fa9696";
      event.borderColor = "#751010";
      event.textColor = "#751010";
    } else {
      switch (event.resourceId) {
        case "1":
          event.color = "#AECDE1";
          event.borderColor = "#AECDE1";
          event.textColor = "white";
          break;
        case "2":
          event.color = "#9DADCD";
          event.borderColor = "#9DADCD";
          event.textColor = "white";
          break;
        case "3":
          event.color = "#93B3BB";
          event.borderColor = "#93B3BB";
          event.textColor = "white";
          break;
        case "4":
          event.color = "#958DB1";
          event.borderColor = "#958DB1";
          event.textColor = "white";
          break;
        case "5":
          event.color = "#906C8D";
          event.borderColor = "#906C8D";
          event.textColor = "white";
          break;
        default:
          break;
      }
    }
  };
  const fetchEvents = () => {
    let localEvents = JSON.parse(localStorage.getItem("events"));

    axios.get("http://localhost:4000/e").then((response) => {
      const res = response.data;
      res.map((e) => {
        setColor(e);
        let calendarApi = calendarRef.current.getApi();
        calendarApi.addEvent(e);
      });

      setEvent((prev) => {
        let d = prev;
        d.id = defaultState.id;
        d.resourceId = defaultState.resourceId;
        d.title = defaultState.title;
        d.start = defaultState.start;
        d.end = defaultState.end;
        d.resourceEditable = false;
        d.isEdit = false;
        d.description = defaultState.description;
        d.operations = defaultState.operations;
        d.calendarId = defaultState.calendarId;
        d.isMaintenance = defaultState.isMaintenance;
        d.autoSchedule = defaultState.autoSchedule;
        return d;
      });
      setEventDuration({
        h: 0,
        m: 0,
      });
    });
  };

  const [resources, setResources] = useState([]);
  const fetchResources = () => {
    axios.get("http://localhost:4000/r").then((response) => {
      let res = response.data;
      setResources(res);
      res.map((e) => {
        let calendarApi = calendarRef.current.getApi();
        calendarApi.addResource({ id: e.resourceId, title: e.resourceName });
      });
    });
  };
  const resourceById = () => {
    resources.map((e) => {
      if (e.resourceId === event.resourceId) {
        resourceName = e.resourceName;
      }
    });
  };
  useEffect(() => {
    fetchConfig();
    fetchEvents();
    fetchResources();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const [date, setDate] = useState(moment());

  const onDateClick = (e) => {
    const date = e.date;
    setEvent((prev) => {
      let d = prev;
      d.id = uuid();
      d.resourceId = e.resource._resource.id;
      d.title = defaultState.title;
      d.start = date;
      d.end = moment(date).add(1, "h")._d;
      d.isEdit = false;
      d.resourceEditable = false;
      d.description = defaultState.description;
      d.operations = defaultState.operations;
      d.calendarId = d.id;
      d.isMaintenance = defaultState.isMaintenance;
      d.autoSchedule = defaultState.autoSchedule;
      return d;
    });
    setEventDuration((prev) => {
      let d = prev;
      d.h = 1;
      d.m = 0;
      return d;
    });
    setModalOpen(true);
  };

  const onEventClick = (e) => {
    // console.log(e.event);
    setEvent((prev) => {
      let d = prev;
      d.id = e.event.id;
      d.resourceId = e.event._def.resourceIds[0];
      d.title = e.event.title;
      d.start = e.event.start;
      d.end = e.event.end;
      d.isEdit = true;
      d.description = e.event.extendedProps.description;
      d.operations = e.event.extendedProps.operations;
      d.calendarId = e.event.extendedProps.calendarId;
      d.isMaintenance = e.event.extendedProps.isMaintenance;
      d.autoSchedule = e.event.extendedProps.autoSchedule;
      return d;
    });
    setEventDuration((prev) => {
      let d = prev;
      let days = e.event.end.getDay() - e.event.start.getDay();
      d.h = e.event.end.getHours() - e.event.start.getHours() + days * 24;
      d.m = e.event.end.getMinutes() - e.event.start.getMinutes();
      return d;
    });
    // console.log(event.description);
    // console.log(event.operations);
    setModalOpen(true);
  };

  const onAdd = (e) => {
    e.preventDefault();
    setColor(event);
    let newEnd = moment(event.start)
      .add(eventDuration.h, "h")
      .add(eventDuration.m, "m");
    setEvent((prev) => {
      let d = prev;
      d.end = newEnd._d;
      d.resourceEditable = false;
      return d;
    });
    let calendarApi = calendarRef.current.getApi();
    calendarApi.addEvent(event);
    // console.log(event.autoSchedule);
    axios
      .post("http://localhost:4000/create", event)
      .then((response) => {
        let calendarApi = calendarRef.current.getApi();
        calendarApi.getEventById(event.id).setProp("id", response.data);
        rearrangeDates(defaultGap, event.resourceId);
      })
      .catch((error) => console.log(error));

    setModalOpen(false);
  };

  const onEdit = (e) => {
    e.preventDefault();
    setColor(event);
    let newEnd = moment(event.start)
      .add(eventDuration.h, "h")
      .add(eventDuration.m, "m");
    setEvent((prev) => {
      let d = prev;
      d.end = newEnd._d;
      return d;
    });
    let calendarApi = calendarRef.current.getApi();
    calendarApi.getEventById(event.id).remove();
    calendarApi.addEvent(event);
    // console.log(event);
    setModalOpen(false);
    rearrangeDates(defaultGap, event.resourceId);
  };

  const onDrop = (e) => {
    if (e.oldResource !== e.newResource) {
      e.revert();
    }
    let calendarApi = calendarRef.current.getApi();
    calendarApi.getEventById(e.event.id).setDates(e.event.start, e.event.end);
    rearrangeDates(defaultGap, e.event._def.resourceIds[0]);
  };

  const onResize = (e) => {
    let calendarApi = calendarRef.current.getApi();
    calendarApi.getEventById(e.event.id).setDates(e.startDelta, e.endDelta);
    rearrangeDates(defaultGap, e.event._def.resourceIds[0]);
  };

  const rearrangeDates = (defaultGap, resourceId) => {
    let calendarApi = calendarRef.current.getApi();
    let res = calendarApi.getResourceById(resourceId);
    let eventsArray = res.getEvents();
    eventsArray.sort((a, b) => {
      return a.start - b.start;
    });

    for (let i = 0; i < eventsArray.length; i++) {
      if (i === 0) {
        let a = eventsArray[0];
        const tempA = {
          id: a.id,
          resourceId: a._def.resourceIds[0],
          title: a.title,
          start: a.start,
          end: a.end,
          allDay: false,
          editable: true,
          resourceEditable: false,
          isEdit: false,
          description: a.extendedProps.description,
          operations: a.extendedProps.operations,
          calendarId: a.extendedProps.calendarId,
          isMaintenance: a.extendedProps.isMaintenance,
          autoSchedule: a.extendedProps.autoSchedule,
        };
        axios
          .put("http://localhost:4000/edit/", tempA)
          .then((response) => {
            console.log(response.status);
          })
          .catch((error) => console.log(error));
      } else {
        let p = calendarApi.getEventById(eventsArray[i - 1].id);
        let q = calendarApi.getEventById(eventsArray[i].id);
        let x;
        if (p.extendedProps.isMaintenance || q.extendedProps.isMaintenance) {
          x = moment(p.end)._d;
        } else {
          x = moment(p.end).add(defaultGap, "h")._d;
        }
        if (q.extendedProps.autoSchedule) {
          if (x !== q.start) {
            q.setStart(x, { maintainDuration: true });
          }
        }

        const tempQ = {
          id: q.id,
          resourceId: q._def.resourceIds[0],
          title: q.title,
          start: q.start,
          end: q.end,
          allDay: false,
          editable: true,
          resourceEditable: false,
          isEdit: false,
          description: q.extendedProps.description,
          operations: q.extendedProps.operations,
          calendarId: q.extendedProps.calendarId,
          isMaintenance: q.extendedProps.isMaintenance,
          autoSchedule: q.extendedProps.autoSchedule,
        };
        // console.log(tempQ);
        axios
          .put("http://localhost:4000/edit/", tempQ)
          .then((response) => {
            console.log(response.status);
          })
          .catch((error) => console.log(error));
      }
    }
  };

  const renderEventContent = (eventInfo) => {
    return (
      <>
        <i>{eventInfo.event.title}</i>
        <i>-</i>
        <i>{eventInfo.event.extendedProps.description}</i>
      </>
    );
  };
  moment.loadPersian({
    dialect: "persian-modern",
    usePersianDigits: true,
  });

  const [operations, setOperations] = useState([]);
  const fetchOperations = () => {
    axios.get("http://localhost:4000/o").then((response) => {
      setOperations(response.data);
    });
  };
  useEffect(() => {
    fetchOperations();
  }, [setModalOpen]);

  return (
    <>
      <div
        style={{
          backgroundColor: "#efefef",
          display: "block",
          position: "relative",
          padding: "1%",
          zIndex: "0",
          fontFamily: "Sahel, Segoe UI",
          height: "100vh",
        }}
        className="BG"
      >
        <FullCalendar
          plugins={plugins}
          ref={calendarRef}
          locale="fa"
          direction="rtl"
          initialView="resourceTimelineWeek"
          customButtons={{
            goTo: {
              text: "?????? ????...",
              click: () => {
                setDateModalOpen(true);
              },
            },
          }}
          headerToolbar={{
            left: "goTo",
            center: "title",
            right: "prev,next,today",
          }}
          buttonText={{
            today: "??????????",
          }}
          //   businessHours={{
          //     daysOfWeek: [1, 2, 3, 6, 7],

          //     startTime: "08:00",
          //     endTime: "20:00",
          //   }}
          editable={true}
          droppable={true}
          height="auto"
          resourceAreaHeaderContent="???????? ????"
          resourceAreaWidth="150px"
          slotMinWidth="80"
          // eventMinWidth="80"
          forceEventDuration={true}
          eventResourceEditable={false}
          defaultTimedEventDuration="00:30"
          eventContent={renderEventContent}
          dateClick={(e) => onDateClick(e)}
          eventClick={(e) => {
            onEventClick(e);
          }}
          eventDrop={(e) => onDrop(e)}
          eventResize={(e) => {
            onResize(e);
          }}
          schedulerLicenseKey="GPL-My-Project-Is-Open-Source"
        />
        <Modal
          show={dateModalOpen}
          onHide={() => setDateModalOpen(false)}
          style={{
            fontFamily: "Sahel, Segoe UI",
          }}
        >
          <Modal.Header
            closeButton
            style={{ backgroundColor: "#efefef", direction: "rtl" }}
          >
            <Container>
              <Row>
                <Col>
                  <Modal.Title>???????????? ??????????</Modal.Title>
                </Col>
              </Row>
            </Container>
          </Modal.Header>
          <Modal.Body
            style={{
              width: "100%",
              margin: " auto",
              backgroundColor: "#efefef",
            }}
          >
            {/* <DatetimePicker
              style={{
                margin: "auto",
                backgroundColor: "#efefef",
              }}
              moment={date}
              onChange={(e) => {
                setDate(e);
              }}
              showTimePicker={false}
              isSolar={true}
              lang="fa"
              Months={[
                "??????????????",
                "????????????????",
                "??????????",
                "??????",
                "??????????",
                "????????????",
                "??????",
                "????????",
                "??????",
                "????",
                "????????",
                "??????????",
              ]}
            /> */}
            <LocalizationProvider dateAdapter={AdapterJalali}>
              <DatePicker
                mask="____/__/__"
                value={date}
                onChange={(e) => setDate(e)}
                renderInput={(params) => <TextField {...params} />}
              />
            </LocalizationProvider>
          </Modal.Body>
          <Modal.Footer style={{ backgroundColor: "#efefef" }}>
            <Button
              variant="primary"
              onClick={(e) => {
                calendarRef.current.getApi().gotoDate(date._d);
                setDateModalOpen(false);
              }}
            >
              ??????
            </Button>
          </Modal.Footer>
        </Modal>
        <Modal
          show={modalOpen}
          style={{
            fontFamily: "Sahel, Segoe UI",
          }}
          onEnter={resourceById()}
          onHide={() => {
            setModalOpen(false);
            setEvent((prev) => {
              let d = prev;
              d.id = defaultState.id;
              d.resourceId = defaultState.resourceId;
              d.title = defaultState.title;
              d.start = defaultState.start;
              d.end = defaultState.end;
              d.isEdit = false;
              d.description = defaultState.description;
              d.operations = defaultState.operations;
              return d;
            });
          }}
        >
          <Modal.Header closeButton style={{ direction: "rtl" }}>
            <Container>
              <Row>
                <Col>
                  <Modal.Title>{resourceName}</Modal.Title>
                </Col>
              </Row>
            </Container>
          </Modal.Header>
          <Modal.Body>
            <Form dir="rtl">
              <div>
                <div>
                  <label>??????????</label>
                  <Form.Control
                    style={{ marginBottom: "10px" }}
                    type="input"
                    placeholder="??????????"
                    value={event.title}
                    onChange={(e) => {
                      setEvent({ ...event, title: e.target.value });
                    }}
                  />
                </div>
                <div style={{ marginBottom: "10px" }}>
                  <label>????????????</label>
                  <Multiselect
                    className={"multiSelectContainer"}
                    isObject={false}
                    options={operations}
                    avoidHighlightFirstOption={true}
                    selectedValues={event.operations}
                    placeholder={"??????????..."}
                    closeOnSelect={false}
                    onSelect={(e) => {
                      setEvent({ ...event, operations: e });
                    }}
                    onRemove={(e) => {
                      setEvent({ ...event, operations: e });
                    }}
                  ></Multiselect>
                </div>
                <div>
                  <label>??????????????</label>
                  <Form.Control
                    style={{ marginBottom: "10px" }}
                    type="input"
                    placeholder="??????????????"
                    value={event.description}
                    onChange={(e) => {
                      setEvent({ ...event, description: e.target.value });
                      console.log(event.description);
                    }}
                  />
                </div>
                <label>??????</label>
                <div style={{ display: "flex" }}>
                  <div style={{ display: "flex" }}>
                    <Form.Control
                      style={{
                        width: "40%",
                        marginLeft: "10px",
                        marginBottom: "10px",
                      }}
                      type="number"
                      min="1"
                      name="hours"
                      id="hours"
                      value={eventDuration.h}
                      placeholder="????????"
                      onChange={(e) => {
                        setEventDuration((prev) => {
                          let d = prev;
                          d.h = e.target.value;
                          return d;
                        });
                        setEventDuration({
                          ...eventDuration,
                          h: e.target.value,
                        });
                        console.log(eventDuration);
                        console.log(moment(event.end).format(format));
                      }}
                    />
                    <p
                      style={{
                        display: "flex",
                        width: "30%",
                      }}
                    >
                      ????????
                    </p>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      width: "50%",
                    }}
                  >
                    <Form.Control
                      style={{
                        width: "40%",
                        marginLeft: "10px",
                      }}
                      type="number"
                      min="0"
                      step="30"
                      max="30"
                      name="minutes"
                      id="minutes"
                      placeholder="??????????"
                      value={eventDuration.m}
                      onChange={(e) => {
                        setEventDuration((prev) => {
                          let d = prev;
                          d.m = e.target.value;
                          return d;
                        });
                        setEventDuration({
                          ...eventDuration,
                          m: e.target.value,
                        });
                        console.log(eventDuration);
                        console.log(moment(event.end).format(format));
                      }}
                    />
                    <p
                      style={{
                        display: "flex",
                        width: "70%",
                      }}
                    >
                      ??????????
                    </p>
                  </div>
                </div>
                <label>??????????????</label>
                <div>
                  <Form.Check
                    type="checkbox"
                    checked={event.isMaintenance}
                    onChange={(e) => {
                      setEvent({
                        ...event,
                        isMaintenance: !event.isMaintenance,
                      });
                      console.log(event.isMaintenance);
                    }}
                  />
                </div>
                <label>???????? ????????????</label>
                <div>
                  <Form.Check
                    type="checkbox"
                    checked={event.autoSchedule}
                    onChange={(e) => {
                      setEvent({ ...event, autoSchedule: !event.autoSchedule });
                      console.log(event.autoSchedule);
                    }}
                  />
                </div>
              </div>
            </Form>
          </Modal.Body>

          <Modal.Footer>
            <div>
              {event.isEdit ? (
                <>
                  <Button variant="primary" onClick={(e) => onEdit(e)}>
                    ?????? ??????????????
                  </Button>
                </>
              ) : (
                <Button
                  variant="success"
                  onClick={(e) => {
                    onAdd(e);
                  }}
                >
                  ?????????? ????????
                </Button>
              )}
            </div>
          </Modal.Footer>
        </Modal>
      </div>
    </>
  );
};

export default ResourceView;
