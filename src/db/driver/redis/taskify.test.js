const taskify = require('./taskify');
const { clone } = require('ramda');

class MockMulti {
  constructor(jobs) {
    this.jobs = jobs;
  }

  get(x) {
    this.jobs.push(x);
    return this;
  }

  exec(cb) {
    cb(null, this.jobs);
  }
}

class MockClient {
  // good method
  get(x, cb) {
    cb(null, x);
  }

  // bad method
  set(x, cb) {
    cb(new Error(`Set of ${x} failed`), null);
  }

  multi(jobs = []) {
    return new MockMulti(jobs);
  }
}

describe('Redis client taskify', () => {
  it('resulting object is no longer instance of MockClient', () => {
    const client = new MockClient();
    const clientT = taskify(client);

    expect(client).toBeInstanceOf(MockClient);
    expect(clientT).not.toBeInstanceOf(MockClient);
  });

  it('taskifying does not mutate original object', () => {
    const client = new MockClient();
    const clientClone = clone(client);
    taskify(client);
    expect(client).toEqual(clientClone);
  });

  it('succesful method calls work', () => {
    const client = new MockClient();
    const clientT = taskify(client);

    clientT
      .get(-1)
      .run()
      .listen({ onResolved: x => expect(x).toBe(-1) });
  });

  it('failing method calls work', () => {
    const client = new MockClient();
    const clientT = taskify(client);

    clientT
      .set(-1)
      .run()
      .listen({
        onRejected: err =>
          expect(err).toEqual(new Error(`Set of ${-1} failed`)),
      });
  });

  it('created multi instances after patch are still instances of MockMulti', () => {
    const client = new MockClient();
    const clientT = taskify(client);

    expect(client.multi()).toBeInstanceOf(MockMulti);
    expect(clientT.multi()).toBeInstanceOf(MockMulti);
  });

  it('multi creates a new Multi object each time', () => {
    const client = new MockClient();
    const clientT = taskify(client);
    expect(clientT.multi()).not.toBe(clientT.multi());
  });

  it('created multi objects have a method exec returning Task with obj state', () => {
    const client = new MockClient();
    const clientT = taskify(client);
    const multi = clientT.multi([1, 2, 3]);

    // add another job
    multi.get(4);

    // type — Task
    const execution = multi.exec();
    expect(execution).toHaveProperty('_computation');

    execution.run().listen({
      onResolved: jobs => {
        expect(jobs).toEqual([1, 2, 3, 4]);
      },
    });
  });

  it('multi creation does not mutate original object', () => {
    const client = new MockClient();
    const clientClone = clone(client);

    const clientT = taskify(client);
    clientT.multi();

    expect(client).toEqual(clientClone);
  });
});
