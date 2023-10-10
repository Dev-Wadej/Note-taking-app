import React from "react";
import { Badge, Button, Col, Row, Stack } from "react-bootstrap";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useBlog } from "../layout/BlogLayout";
import { ReactMarkdown } from "react-markdown/lib/react-markdown";
import { useDeleteBlog } from "../service/blog/mutation";

type BlogProps = {
  onDelete: (id: string) => void;
};

const Blog = ({ onDelete }: BlogProps) => {
  const note = useBlog();
  const navigate = useNavigate();
  const { id, routeid } = useParams();

  const { mutate } = useDeleteBlog({
    addedUrl: routeid as string
  });
  const handleDelete = () => {
    onDelete(note.id);
    navigate("/");
    mutate({});
  };
  return (
    <>
      <Row className="items-center mb-4">
        <Col>
          <h1>{note.title}</h1>
          {note.tags.length > 0 && (
            <Stack gap={1} direction="horizontal" className="flex-wrap">
              {note.tags.map((tag) => (
                <Badge key={tag.id} className="truncate">
                  {tag.label}{" "}
                </Badge>
              ))}
            </Stack>
          )}
        </Col>
        <Col xs={"auto"}>
          <Stack gap={2} direction="horizontal">
            <Link to={`/${note.id}/${routeid}/edit`}>
              <Button className="bg-[#3A2857] hover:bg-white hover:text-[#3A2857]">
                Edit!!
              </Button>
            </Link>
            <Button onClick={handleDelete} variant="outline-danger">
              Delete
            </Button>
            <Link to={"/"}>
              <Button variant="outline-secondary">Back</Button>
            </Link>
          </Stack>
        </Col>
      </Row>
      <ReactMarkdown>{note.markdown}</ReactMarkdown>
    </>
  );
};

export default Blog;
