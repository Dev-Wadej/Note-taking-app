type CustomError = {
  data: {
    error: {
      location: string;
      msg: string;
      path: string;
    }[];
    message: string;
  };
};

const handleResponseError = (error: CustomError) => {
  if (error && error.data) {
    const { error: errors, message } = error.data;

    if (message) {
      console.log({ message, state: "error" });
      return;
    }

    if (typeof errors === "string") {
      console.log({ message: errors, state: "error" });
      return;
    }

    errors.forEach((error) => {
      return console.log({ message: error.msg, state: "error" });
    });
  } else {
    console.log(error);
  }
};

export default handleResponseError;
