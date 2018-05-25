#!/bin/bash

yarn unlink @textactor/domain
yarn unlink @textactor/actor-domain

yarn add @textactor/domain
yarn add @textactor/actor-domain

yarn test
