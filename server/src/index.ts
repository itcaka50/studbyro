import express, { Express, Request, Response, NextFunction } from 'express';
import dotenv from 'dotenv';
import { config } from './config';
import { app } from './app';

app.listen(config.port, () => {
    console.log(`Server listening on port ${config.port}`);
});
