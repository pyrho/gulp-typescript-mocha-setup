import 'should';
import {add} from './../src';

describe('Adding a number', () => {
    it('should work with a valid input', () => {
        add(1).should.eql(2);
    });

    it('should not work with an invalid input', () => {
        add(null).should.eql(1);
    });
});
