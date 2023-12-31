import { useEffect, useState } from "react";
import { setCredentials } from "../slices/authSlice";
import { useSelector, useDispatch } from "react-redux";
import { toast } from "react-toastify";
import {
  FaBuilding,
  FaCheck,
  FaCheckCircle,
  FaGoodreads,
  FaRegBuilding,
  FaSchool,
  FaTimes,
  FaUserFriends,
  FaUserPlus,
} from "react-icons/fa";
import { Table, Form, Button, Row, Col, Image } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";
import Loader from "../components/Loader";
import Message from "../components/Message";
import {
  useProfileMutation,
  useProfileImageMutation,
} from "../slices/usersApiSlice";
import { useGetMyOrdersQuery } from "../slices/orderApiSlice";

const ProfileScreen = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [profileImage, setProfile] = useState("");
  const [friends, setFriends] = useState("");
  const [faculty, setFaculty] = useState("");
  const [department, setDepartment] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const dispatch = useDispatch();
  const { userinfo } = useSelector((state) => state.auth);
  const [profile, { isLoading: loadingUpdateProfile, error }] =
    useProfileMutation();

  const { data: orders, isLoading, isError } = useGetMyOrdersQuery();
  const [updateProfileImage, { isLoading: loading, error: err }] =
    useProfileImageMutation();

  console.log(userinfo._id);
  useEffect(() => {
    if (userinfo) {
      setName(userinfo.name);
      setEmail(userinfo.email);
      setProfile(userinfo.profile);
      setFriends(userinfo.friends);
      setFaculty(userinfo.faculty);
      setDepartment(userinfo.department);
    }
  }, [userinfo, userinfo.name, userinfo.email, userinfo.profile, userinfo.friends]);

  const updateImageHandler = async (e) => {
    const formData = new FormData();
    formData.append("image", e.target.files[0]);
    try {
      const res = await updateProfileImage(formData).unwrap();
      toast.success("Profile Image updated successfully");
      setProfile(res.image);
    } catch (error) {
      toast.error(error?.data?.message || error.error);
    }
  };

  const submitHandler = async (e) => {
    e.preventDefault();

    if (password === confirmPassword) {
      try {
        const res = await profile({
          _id: userinfo._id,
          name,
          email,
          password,
          profile: profileImage,
          friends,
          faculty,
          department
        }).unwrap();
        dispatch(setCredentials(res));
        toast.success("Profile Updated");
      } catch (error) {
        toast.error(error?.data?.message || error.error);
      }
    } else {
      toast.error("Password do not match");
    }
  };
  return (
    <Row>
      <Col md={4}>
        <div className="head shadow-sm rounded-2 my-3 d-flex align-content-center justify-content-around flex-wrap ">
          <h2 className=" py-2 shadow-sm  fw-medium   w-100 text-center">
            <Image
              src={userinfo.profile}
              alt="Profile image"
              className=" shadow mx-2 "
              style={{ width: "70px", borderRadius: "100%", height:"70px" }}
            />
             {userinfo.name}
          </h2>
          <h2 className=" d-inline-block shadow-sm   text-center gap-2 justify-content-between    position-relative d-flex   mt-0 py-3 px-4 w-100 fw-medium" style={{fontSize:"15px", top:"-5px", alignItems:"center",}}>
          <span className="  px-3 py-3 shadow-sm rounded-2 text-success" style={{ color:"green", fontSize:"12px"}}>
          <FaRegBuilding className=" shadow-sm px-2 py-1 mx-2 " style={{ color:"green", fontSize:"35px", borderRadius:"20%", verticalAlign:"middle"}} /> Faculty
            </span>
              <span className="  px-3 py-3 shadow-sm rounded-2 text-success" style={{ color:"green", fontSize:"12px"}}> {userinfo.faculty} </span>
          </h2>
          <h2 className=" d-inline-block shadow-sm  text-center gap-2 justify-content-between   position-relative d-flex   mt-0 py-3 px-4 w-100 fw-medium" style={{fontSize:"15px",  alignItems:"center",}}>
            <span className="  px-3 py-3 shadow-sm rounded-2 text-success" style={{ backgroundColor:"rgba(240, 255, 255,0.1)", fontSize:"12px"}}>
            <FaUserFriends className=" shadow-sm px-2 py-1 mx-2 " style={{ color:"green", fontSize:"35px", borderRadius:"20%", verticalAlign:"middle"}} /> Study-Mates
            </span>
             <span className="  px-3 py-3 shadow-sm rounded-2 text-success" style={{ backgroundColor:"rgba(240, 255, 255,0.1)", fontSize:"12px"}}> {userinfo.friends.length} Study Mates</span>
          </h2>
          <h2 className=" d-inline-block text-center gap-2 position-relative d-flex justify-content-between    mt-0 py-3 px-4 w-100 fw-medium" style={{fontSize:"15px", top:"-5px", alignItems:"center",}}>
            <span className="  px-3 py-3 shadow-sm rounded-2  text-success" style={{ color:"green", fontSize:"12px"}}>
            <FaSchool className=" shadow-sm px-2 py-1 mx-2 " style={{ color:"green", fontSize:"35px", borderRadius:"20%", verticalAlign:"middle"}} /> Department: 
              </span> <span className="  px-3 py-3 shadow-sm rounded-2  text-success" style={{ color:"green", fontSize:"12px"}}> {userinfo.department} </span>
          </h2>
        </div>

        <Form onSubmit={submitHandler} className="py-2 px-2 ">
          <Form.Group controlId="name" className="my-2">
            <Form.Label>Name</Form.Label>
            <Form.Control
              type="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter name"
              className="py-3 shadow-sm"
            ></Form.Control>
          </Form.Group>
          <Form.Group controlId="email" className="my-2">
            <Form.Label className=" shadow-0 rounded-0 px-2 py-1">
              email
            </Form.Label>
            <Form.Control
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter email"
              className="py-3 shadow-sm "
            ></Form.Control>
          </Form.Group>
          <Form.Group controlId="password" className="my-2">
            <Form.Label>Password</Form.Label>
            <Form.Control
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter password"
              className="py-3 shadow-sm"
            ></Form.Control>
          </Form.Group>
          <Form.Group controlId="password" className="my-2">
            <Form.Label>Profile Image</Form.Label>
            <Form.Control
              type="file"
              label="choose image"
              onChange={updateImageHandler}
              placeholder="Enter profile url"
              className="my-1 shadow-sm"
            ></Form.Control>
            <Form.Control
              type="text"
              value={profileImage}
              onChange={(e) => setProfile(e.target.value)}
              placeholder="Enter profile url"
              className="py-3 shadow-sm"
            ></Form.Control>
          </Form.Group>
          <Form.Group controlId="confirmpassword" className="my-2">
            <Form.Label>Confirm Password</Form.Label>
            <Form.Control
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm password"
              className="py-3 shadow-sm"
            ></Form.Control>
          </Form.Group>
          <Button type="submit" variant="primary">
            Submit
          </Button>
          {loadingUpdateProfile && <Loader />}
        </Form>
      </Col>
      <Col md={6}>
        <h2 className=" border-bottom mt-3">Questions</h2>
        {isLoading ? (
          <Loader />
        ) : isError ? (
          <Message varient="danger">
            {isError?.data?.message || isError.message}
          </Message>
        ) : (
          <Table striped bordered hover responsive className="table-sm">
            <thead>
              <tr>
                <th>DATE</th>
                <th>TOTAL</th>
                <th>PAID (&#x20A6;)</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order._id}>
                  <td>{order.createdAt.substring(0, 10)}</td>
                  <td>{order.total}</td>
                  <td>
                    {order.isPaid ? (
                      <FaCheck className="text-primary" />
                    ) : (
                      <FaTimes className="text-danger" />
                    )}
                  </td>

                  <td>
                    <LinkContainer to={`/ordered/${order._id}/${order.user}`}>
                      {order.isPaid ? (
                        <Button className="btn-sm" variant="light">
                          Details
                        </Button>
                      ) : (
                        <p></p>
                      )}
                    </LinkContainer>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        )}
      </Col>
    </Row>
  );
};

export default ProfileScreen;
