const ignoreFavicon = (req: any, res: any, next: any) => {
  if ((req.originUrl = '/favicon.ico')) {
    res.status(204).json({ nope: true });
  } else {
    next();
  }
};

export default ignoreFavicon;
